import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create.column.dto';
import { UserInfo } from 'utils/userInfo.decorator';
import { ChangeColumnDto } from './dto/change.column.dto';
import { User } from 'src/user/entities/user.entity';
import { ChangeProcedureDto } from './dto/change.procedure.dto';
import { BoardRolesGuard } from 'src/auth/boardRoles.guard';
import { BoardRole } from 'src/board/types/boardmember-role.type';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(BoardRolesGuard)
@Controller('boards/:boardId/columns')
@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  //컬럼 생성
  @Roles(BoardRole.OWNER)
  @Post()
  async createColumn(
    @UserInfo() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body()
    createColumnDto: CreateColumnDto,
  ) {
    return await this.columnService.createColumn(
      user,
      boardId,
      createColumnDto,
    );
  }

  //컬럼 이름 수정
  @Roles(BoardRole.OWNER)
  @Patch('/:column_id')
  @HttpCode(200)
  async updateColumn(
    @Param('column_id', ParseIntPipe) column_id: number,
    @Body() changeColumnDto: ChangeColumnDto,
  ) {
    await this.columnService.updateColumn(column_id, changeColumnDto);
  }

  //컬럼 삭제
  @Roles(BoardRole.OWNER)
  @Delete('/:column_id')
  @HttpCode(204)
  async deleteColumn(@Param('column_id', ParseIntPipe) column_id: number) {
    await this.columnService.deleteColumn(column_id);
  }

  //컬럼 순서 이동
  @Roles(BoardRole.OWNER)
  @Patch('/:column_id/change')
  @HttpCode(201)
  async changePriority(
    @Param('column_id', ParseIntPipe) column_id: number,
    @Body() changeProcedureDto: ChangeProcedureDto,
  ) {
    await this.columnService.changeColumnPriority(
      column_id,
      changeProcedureDto,
    );
  }

  //컬럼 조회
  @Get()
  async getColumns(@Param('boardid', ParseIntPipe) boardid: number) {
    return await this.columnService.getcolumns(boardid);
  }
}
