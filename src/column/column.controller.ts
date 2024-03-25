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
import { ChangeColumnDto } from './dto/change.column.dto';
import { User } from 'src/user/entities/user.entity';
import { ChangeProcedureDto } from './dto/change.procedure.dto';
import { BoardRolesGuard } from 'src/auth/boardRoles.guard';
import { BoardRole } from 'src/board/types/boardmember-role.type';
import { Roles } from 'src/auth/roles.decorator';
import { UserInfo } from '../../utils/userInfo.decorator';

@UseGuards(BoardRolesGuard)
@Controller('boards/:boardId/columns')
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
  @Delete('/:columnId')
  @HttpCode(204)
  async deleteColumn(@Param('columnId', ParseIntPipe) columnId: number) {
    await this.columnService.deleteColumn(columnId);
  }

  //컬럼 순서 이동
  @Roles(BoardRole.OWNER)
  @Patch('/:columnId/change')
  @HttpCode(201)
  async changePriority(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() changeProcedureDto: ChangeProcedureDto,
  ) {
    await this.columnService.changeColumnPriority(columnId, changeProcedureDto);
  }

  //컬럼 조회
  @Get()
  async getColumns(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.columnService.getcolumns(boardId);
  }
}
