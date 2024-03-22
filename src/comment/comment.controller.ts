import { Body, Controller, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { BoardRolesGuard } from 'src/auth/boardRoles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BoardRole } from 'src/board/types/boardmember-role.type';
import { UserInfo } from 'utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from './dto/create.comment.dto';

@UseGuards(BoardRolesGuard)
@Controller('boards/:boardId/cards')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  //댓글 작성
  @Roles(BoardRole.OWNER || BoardRole.OWNER)
  async createComments(
    @UserInfo() user: User,
    @Param('/:cardId/comment') cardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(
      user,
      cardId,
      createCommentDto,
    );
  }
}
