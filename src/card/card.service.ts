import { BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { Columns } from 'src/column/entities/column.entity';
import { Card } from './entities/card.entity';
import { UtilsService } from 'utils/utils.service';
import { AwsService } from '../aws/aws.service'
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/card.create.dto';
import { LexoRank } from 'lexorank';
import { UpdateCardDto } from './dto/card.update.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
  ) {}
  // 카드 생성
    async createCard(createCardDto: CreateCardDto) {
      const columnExists = await this.columnRepository.findOneBy({ id: createCardDto.columnId });

      if (!columnExists) {
        throw new NotFoundException('카드를 추가하려는 컬럼이 존재하지 않습니다.');
      }

      let lexoRank;
      const existingCard = await this.cardRepository.findOne({ where: { columns: {id: createCardDto.columnId} }, order: { lexo: "DESC" } })
      if (existingCard && existingCard.lexo) {
        lexoRank = LexoRank.parse(existingCard.lexo.toString()).genNext();
      } else {
        lexoRank = LexoRank.middle();
      }
    
      const newCard: Card = this.cardRepository.create({
        title: createCardDto.title,
        description: createCardDto.description,
        color: createCardDto.color,
        dead_line: createCardDto.dead_line,
        lexo: lexoRank.toString(),
        columns: {id: createCardDto.columnId }
      });
    
      const savedCard = await this.cardRepository.save(newCard);
      return savedCard;
    }

  // 카드 목록 보기
  async findAll() {
    //TODO relation 수정예정.
    const cards = await this.cardRepository.find({ relations: ['columns'] })

    const sortedCards = cards
    .sort((a, b) => {
      if (a.lexo && b.lexo) {
        const lexoA = LexoRank.parse(a.lexo.toString());
        const lexoB = LexoRank.parse(b.lexo.toString());
        return lexoA.compareTo(lexoB);
      }
      return 0; // lexo 값이 없는 경우 정렬하지 않음
    })
    .map((card) => ({
      data: {
        // column_id: card.columns.id,
        id: card.id,
        title: card.title,
        description: card.description,
        color: card.color,
        dead_line: card.dead_line,
        lexo: card.lexo.toString(),
      },
    }));

    return sortedCards
  }

  // 카드 이동(lexoRank 변경)
  async moveCard(cardId: number, targetCardId: number) {
    const targetCard = await this.cardRepository.findOne({
      where: {id: targetCardId}
    });
    const movingCard = await this.cardRepository.findOne({
      where: {id: cardId}
    });

    if (!targetCard || !movingCard) {
      throw new NotFoundException('선택한 카드를 찾을 수 없습니다.')
    }

    // targetCard 이전 카드
    const prevCard = await this.cardRepository
    .createQueryBuilder('card')
    .where('card.lexo < :lexo', { lexo: targetCard.lexo.toString() 
    }).orderBy('card.lexo', 'DESC')
    .getOne()

    let newLexoRank
    if(prevCard) {
      // prevCard.lexo와 targetCard.lexo를 LexoRank 객체로 변환
      const prevLexoRank = LexoRank.parse(prevCard.lexo.toString());
      const targetLexoRank = LexoRank.parse(targetCard.lexo.toString());
    
      // target과 그 이전 card 사이에 새로운 lexo 생성
      newLexoRank = prevLexoRank.between(targetLexoRank).toString();
    } else {
      // target이 첫번째면 최소값으로
      const targetLexoRank = LexoRank.parse(targetCard.lexo.toString());
      newLexoRank = LexoRank.min().between(targetLexoRank).toString();
    }
    
    movingCard.lexo = newLexoRank;
    await this.cardRepository.save(movingCard);

    const sortedCards = (await this.cardRepository.find())
    .sort((a, b) => {
      if (a.lexo && b.lexo && a.lexo.compareTo && b.lexo.compareTo) {
        return a.lexo.compareTo(b.lexo);
      }
      return 0; // lexo 값이 없는 경우 정렬하지 않음
    })
    .map((card) => ({
      data: {
        columns_id: { where: movingCard.columns.id},
        id: card.id,
        title: card.title,
        description: card.description,
        color: card.color,
        dead_line: card.dead_line,
        lexo: card.lexo.toString(),
      },
    }));

  return sortedCards;
  }

  // 카드 수정
  async modifyCard(
    user: User,
    cardId: number, 
    updateCardDto: UpdateCardDto, 
    file: Express.Multer.File
    ) {

      //카드 작성자 확인
      const cardUser = await this.cardRepository.findOne({
        where: { boardMember: {user_id :  user.id} },
      });
  
      if (!cardUser) {
        throw new UnauthorizedException(
          '카드 작업자만 카드를 수정할 수 있습니다.',
        );
      }
      
  const card = await this.cardRepository.findOne({
    where: { id: cardId },
  });

  if (!card) {
    throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
  }

  //이미 입력된 이미지가 있다면 S3에서 기존 이미지 삭제
  if (card.image_url !== null) {
    await this.awsService.DeleteUploadToS3(card.image_url);
  }

  //S3에 이미지 업로드, url return
  const imageName = this.utilsService.getUUID();
  const ext = file.originalname.split('.').pop();

  const imageUrl = await this.awsService.imageUploadToS3(
    `${imageName}.${ext}`,
    file,
    ext,
  );

  //DB에 저장
  const uploadCard = await this.cardRepository.save({
    id: cardId,
    title: updateCardDto.title,
    description: updateCardDto.description,
    color: updateCardDto.color,
    dead_line: updateCardDto.dead_line,
    image_url: `${imageName}.${ext}`,
    lexo: card.lexo
  });

  return uploadCard;
  }

  // 카드 삭제
  async deleteCard(user:User, cardId: number) {
    const card = await this.cardRepository.findOne({
      where: {id: cardId},
    })

    if (!card) {
      throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
    }

          //카드 작성자 확인
          const cardUser = await this.cardRepository.findOne({
            where: { boardMember: {user_id :  user.id} },
          });
      
          if (!cardUser) {
            throw new UnauthorizedException(
              '카드 작업자만 카드를 삭제할 수 있습니다.',
            );
          }

    const deleteCard = await this.cardRepository.delete({id: card.id})
  }

  //카드 상세 조회
  async getCard(cardId: number) {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
    });
  }
}