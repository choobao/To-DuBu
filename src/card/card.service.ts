import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { Columns } from 'src/column/entities/column.entity';
import { Card } from './entities/card.entity';
import { UtilsService } from 'utils/utils.service';
import { AwsService } from 'src/aws/aws.service';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/card.create.dto';
import { LexoRank } from 'lexorank';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>
  ) {}
  // 카드 생성
    async createCard(createCardDto: CreateCardDto) {
      let lexoRank;
      const existingCard = await this.cardRepository.findOne({ where: {}, order: { lexo: "DESC" } })
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
        lexo: lexoRank.toString()
      });
    
      const savedCard = await this.cardRepository.save(newCard);
      return savedCard;
    }

  // 카드 목록 보기
  async findAll() {
    const cards = await this.cardRepository.find()

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
        id: card.id,
        title: card.title,
        description: card.description,
        color: card.color,
        dead_line: card.dead_line,
        lexo: card.lexo.toString(),
      },
    }));
    // TODO 확인 위해 넣어놓은 것. 알림문구로 수정예정
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

  // 카드 삭제
  async deleteCard(cardId: number) {
    const card = await this.cardRepository.findOne({
      where: {id: cardId},
    })

    if (!card) {
      throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
    }

    const deleteCard = await this.cardRepository.delete({id: card.id})
  }
}

// constructor(
//   @InjectRepository(Columns)
//   private readonly columnRepository: Repository<Columns>,
//   @InjectRepository(Board)
//   private readonly boardRepository: Repository<Board>,
//   @InjectRepository(BoardMember)
//   private readonly boardMemberRepository: Repository<BoardMember>,
//   @InjectRepository(Card)
//   private readonly cardRepository: Repository<Card>,
//   private readonly utilsService: UtilsService,
//   private readonly awsService: AwsService,
// ) {}

// //코드 합친 후 카드생성api에 이미지 입력코드 꼭 넣기!!!!!

// //카드 이미지 입력(수정)
// async insertMutiformForCard(cardId: number, file: Express.Multer.File) {
//   const card = await this.cardRepository.findOne({
//     where: { id: cardId },
//   });

//   if (!card) {
//     throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
//   }

//   //이미 입력된 이미지가 있다면 S3에서 기존 이미지 삭제
//   if (card.image !== null) {
//     await this.awsService.DeleteUploadToS3(card.image);
//   }

//   //S3에 이미지 업로드, url return
//   const imageName = this.utilsService.getUUID();
//   const ext = file.originalname.split('.').pop();

//   const imageUrl = await this.awsService.imageUploadToS3(
//     `${imageName}.${ext}`,
//     file,
//     ext,
//   );

//   //DB에 저장
//   const uploadCardDB = await this.cardRepository.update(
//     { id: card.id },
//     { image: `${imageName}.${ext}` },
//   );

//   return { imageUrl };
// }