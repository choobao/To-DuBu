import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

import { BoardService } from './board.service';
import { BoardRolesGuard } from 'src/auth/boardRoles.guard';
import { BoardRole } from './types/boardmember-role.type';

import { UserInfo } from 'utils/userInfo.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserPasswordDto } from 'src/user/dto/user-password.dto';
import { UserEmailDto } from 'src/user/dto/user-email.dto';

@UseGuards(BoardRolesGuard)
@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async createBoard(
    @UserInfo() { id }: { id: number },
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return await this.boardService.createBoard(id, createBoardDto);
  }

  @Patch('/:boardId')
  @Roles(BoardRole.OWNER)
  async updateBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return await this.boardService.updateBoard(boardId, updateBoardDto);
  }

  @Delete('/:boardId')
  @Roles(BoardRole.OWNER)
  @HttpCode(204)
  deleteBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @UserInfo() user: User,
    @Body() passwordDto: UserPasswordDto,
  ) {
    this.boardService.deleteBoard(boardId, user.id, passwordDto.password);
  }

  @Post('/invite/:boardId')
  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  async inviteBoardMember(
    @Param('boardId') boardId: number,
    @Body() emailDto: UserEmailDto,
  ) {
    return await this.boardService.inviteMember(+boardId, emailDto.email);
  }

  @Post('/accept/:token')
  acceptInvitation(@Param('token') token: string) {
    this.boardService.acceptInvitation(token);
  }
}
