import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { BoardRolesGuard } from 'src/auth/boardRoles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BoardRole } from 'src/board/types/boardmember-role.type';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from './dto/create.comment.dto';
import { UserInfo } from '../../utils/userInfo.decorator';

@UseGuards(BoardRolesGuard)
@Controller('boards/:boardId/cards')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  //댓글 작성
  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  @Post('/:cardId')
  async createComments(
    @UserInfo() user: User,
    @Param('cardId') cardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(
      user,
      cardId,
      createCommentDto,
    );
  }
}
