import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/card/entitis/card.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create.comment.dto';
import { Comments } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
  ) {}

  async createComment(
    user: User,
    cardId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const userId = user.id;
    const content = createCommentDto.content;

    //해당하는 카드 찾기
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
    });

    if (!card) {
      throw new NotFoundException('해당하는 카드가 존재하지 않습니다.');
    }

    //댓글 등록하기
    const comment = await this.commentRepository.save({
      content,
      user_id: userId,
      card_id: cardId,
    });

    return comment;
  }
}
