import {
  Body,
  Controller,
  Delete,
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
import { RolesGuard } from 'src/auth/roles.guard';
import multer from 'multer';

//가드 변경 필요!!!!!!!!!!!!
// @UseGuards(RolesGuard)
@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  //컬럼 생성
  @Post('/:boardId')
  async createColumn(
    // @UserInfo() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body()
    createColumnDto: CreateColumnDto,
    @Res() res,
  ) {
    console.log('통과함');
    const createColumn = await this.columnService.createColumn(
      // user.id,
      boardId,
      createColumnDto,
    );

    res.status(201).json({ message: '컬럼 등록이 완료되었습니다.' });
  }

  //컬럼 이름 수정
  @Patch('/:columnId')
  async updateColumn(
    @UserInfo() user: User,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() changeColumnDto: ChangeColumnDto,
    @Res() res,
  ) {
    const updateColumn = await this.columnService.updateColumn(
      user.id,
      columnId,
      changeColumnDto,
    );

    res.status(201).json({ message: '컬럼 이름 수정이 완료되었습니다.' });
  }

  //컬럼 삭제
  @Delete('/:columnId')
  async deleteColumn(
    @UserInfo() user: User,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Res() res,
  ) {
    const deleteColumn = await this.columnService.deleteColumn(
      user.id,
      columnId,
    );

    res.status(201).json({ message: '컬럼 삭제가 완료되었습니다.' });
  }

  //컬럼 순서 이동
  @Post('/:columnId/change')
  async changePriority(
    @UserInfo() user: User,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() procedure: number,
    @Res() res,
  ) {
    const changePriority = await this.columnService.changeColumnPriority(
      columnId,
      procedure,
    );

    res.status(201).json({ message: '컬럼 순서변경이 완료되었습니다.' });
  }
}
