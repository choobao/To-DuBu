import { Body, Controller, Res } from '@nestjs/common';
import { ColumnService } from './column.service';
import { createColumnDto } from './dto/create.column.dto';
import { UserInfo } from 'utils/userInfo.decorator';
import { changeColumnDto } from './dto/change.column.dto';
import { Role } from 'src/board/types/boardmember-role.type';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  //컬럼 생성
  async createColumn(
    // @UserInfo() user: User,
    @Role(Role.OWNER) //커스텀 데코레이터? BoardMembers의 롤이 admin이어야 함
    @Body()
    createColumnDto: createColumnDto,
    @Res() res,
  ) {
    const createColumn = await this.columnService.createColumn(
      user,
      createColumnDto.title,
      createColumnDto.procedure,
    );

    res.status(201).json({ message: '컬럼 등록이 완료되었습니다.' });
  }

  //컬럼 이름 수정
  //컬럼 생성
  async updateColumn(
    // @UserInfo() user: User,
    @Body() updateColumnDto: changeColumnDto,
    @Res() res,
  ) {
    const updateColumn = await this.columnService.updateColumn(
      user,
      updateColumnDto.title,
    );

    res.status(201).json({ message: '컬럼 이름 수정이 완료되었습니다.' });
  }
  //   async updateColumn(id: number, title: string) {
  //     const column = await this.columnRepository.findOne({
  //       where: { id },
  //     });

  //     if (!column) {
  //       throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
  //     }

  //     const updateColumn = await this.columnRepository.update(
  //       { id: column.id },
  //       { title },
  //     );
  //   }

  //   //컬럼 삭제
  //   async deleteColumn(id: number) {
  //     const column = await this.columnRepository.findOne({
  //       where: { id },
  //     });

  //     if (!column) {
  //       throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
  //     }

  //     const updateColumn = await this.columnRepository.delete({ id: column.id });
  //   }

  //   //컬럼 순서 이동
}
