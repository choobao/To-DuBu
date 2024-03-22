import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Columns } from './entities/column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from 'src/board/entity/board.entity';
import { CreateColumnDto } from './dto/create.column.dto';
import { ChangeProcedureDto } from './dto/change.procedure.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async boardList(boards: Columns[], procedure: number) {
    let boardList = [];

    for (let i = 0; i < boards.length; i++) {
      boardList.push(boards[i]);
    }

    //boards.length보다 큰 값 입력시 오류
    if (boardList.length < procedure) {
      throw new BadRequestException('맞지않는 순서입니다.');
    }
    boardList.sort((a, b) => a.procedure - b.procedure);

    let xx: number, yy: number, decimalProcedure: number;
    const tolerance = 0.0001;

    if (procedure == 1) {
      xx = boardList[0].procedure;

      decimalProcedure = xx - Math.random();
      decimalProcedure = Math.max(decimalProcedure, 0.1);
    } else if (procedure == 2) {
      xx = boardList[0].procedure;
      yy = boardList[1].procedure;

      decimalProcedure = xx + Math.random();

      while (decimalProcedure > yy && decimalProcedure - yy > tolerance) {
        decimalProcedure -= 0.001;
      }
    } else {
      xx = boardList[procedure - 2].procedure;
      yy = boardList[procedure - 1].procedure;

      console.log(xx, yy);

      decimalProcedure = xx + Math.random();
      while (decimalProcedure > yy && decimalProcedure - yy > tolerance) {
        decimalProcedure -= 0.001;
      }
    }

    return decimalProcedure;
  }

  //컬럼 생성
  async createColumn(
    user: User,
    board_id: number,
    createColumnDto: CreateColumnDto,
  ) {
    const id = user.id;
    const title = createColumnDto.title;
    const procedure = createColumnDto.procedure;

    //보드가 존재하는지 확인
    const board = await this.boardRepository.findOne({
      where: { id: board_id },
    });

    console.log(board);

    if (!board) {
      throw new NotFoundException('해당하는 보드가 존재하지 않습니다.');
    }

    const boards = await this.columnRepository.find({
      where: { board_id },
      select: ['id', 'procedure'],
    });

    const decimalProcedure = await this.boardList(boards, procedure);

    const column = await this.columnRepository.save({
      title,
      procedure: decimalProcedure,
      board_id,
      user_id: id,
    });
  }

  //컬럼 이름 수정
  async updateColumn(user: User, columnId: number, changeColumnDto: any) {
    const id = user.id;
    const title = changeColumnDto.title;

    //컬럼 확인
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
    });

    if (!column) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }

    const updateColumn = await this.columnRepository.update(
      { id: column.id },
      { title },
    );
  }

  //컬럼 삭제
  async deleteColumn(user: User, columnId: number) {
    const id = user.id;
    //컬럼 확인
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
    });

    if (!column) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }

    const delteColumn = await this.columnRepository.delete({ id: columnId });
  }

  //컬럼 순서 이동
  async changeColumnPriority(
    user: User,
    columnId: number,
    changeProcedureDto: ChangeProcedureDto,
  ) {
    const id = user.id;
    const procedure = changeProcedureDto.procedure;

    console.log(id);

    //컬럼 확인
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
    });
    console.log('컬럼은 찾았음', column);
    if (!column) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }

    const boards = await this.columnRepository.find({
      where: { board_id: column.board_id },
      select: ['id', 'procedure'],
    });

    console.log(boards);

    if (!boards) {
      throw new NotFoundException('해당하는 보드가 존재하지 않습니다.');
    }

    const decimalProcedure = await this.boardList(boards, procedure);

    //컬럼 순서이동 => 해당 컬럼을 찾아서 procedure을 수정해서 업데이트 해준다

    console.log('순서이동');
    const changePriority = await this.columnRepository.update(
      { id: column.id },
      { procedure: decimalProcedure },
    );
  }

  async getcolumns(board_id: number) {
    const columns = await this.columnRepository.find({
      where: { board_id },
    });

    if (!columns) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }
    columns.sort((a, b) => a.procedure - b.procedure);

    return columns;
  }
}
