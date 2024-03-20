import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { Columns } from 'src/column/entities/column.entity';
import { Repository } from 'typeorm';
import { Card } from './entitis/card.entity';
import { UtilsService } from 'utils/utils.service';
import { AwsService } from 'src/aws/aws.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
  ) {}

  //코드 합친 후 카드생성api에 이미지 입력코드 꼭 넣기!!!!!

  //카드 이미지 입력(수정)
  async insertMutiformForCard(cardId: number, file: Express.Multer.File) {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
    });

    if (!card) {
      throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
    }

    //이미 입력된 이미지가 있다면 S3에서 기존 이미지 삭제
    if (card.image !== null) {
      await this.awsService.DeleteUploadToS3(card.image);
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
    const uploadCardDB = await this.cardRepository.update(
      { id: card.id },
      { image: `${imageName}.${ext}` },
    );

    return { imageUrl };
  }
}
