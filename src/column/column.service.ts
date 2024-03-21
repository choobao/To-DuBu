import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Columns } from './entities/column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { Role } from 'src/board/types/boardmember-role.type';
import { CreateColumnDto } from './dto/create.column.dto';
import { ChangeProcedureDto } from './dto/change.procedure.dto';

//보드에 권한이 있는지 확인ㅜㅜ
// const isOwner = await this.boardMemberRepository.findOne({
//   where: { userId: id, boardId: board.id },
// });

// if (isOwner.role !== Role.OWNER) {
//   throw new UnauthorizedException('해당 보드에 권한이 없습니다.');
// }

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
  ) {}

  async boardList(boards: Columns[], procedure: number) {
    //컬럼 순서 넣는 로직 작성
    //기본적으로 우선순위 1.1,2.2,3.3을 가진 컬럼이 존재한다고 가정(보드만들때 기본생성)
    //해당 보드의 컬럼 전부 가져와서 해당우선순위대로 정렬해서 리스트 작성
    //사용자가 입력한 우선순위에 해당하는 (가정: 2) 리스트 배열의 0 1번째 컬럼의 우선순위 가져오기
    //무조건 그 우선순위 사잇값이 들어가도록 해서 데이터베이스에 저장하기
    let boardList = [];

    for (let i = 0; i < boards.length; i++) {
      boardList.push(boards[i]);
    }
    console.log(boardList);
    //boards.length보다 큰 값 입력시 오류
    if (boardList.length < procedure) {
      throw new BadRequestException('맞지않는 순서입니다.');
    }
    boardList.sort((a, b) => a.procedure - b.procedure);

    console.log(boardList[0].procedure);
    console.log(procedure);

    let xx: number, yy: number, decimalProcedure: number;
    const tolerance = 0.0001;

    if (procedure == boardList.length) {
      xx = boardList[boardList.length - 1].procedure;
      decimalProcedure = xx + 123.45;
      return decimalProcedure;
    }

    if (procedure == 1) {
      xx = boardList[0].procedure;

      decimalProcedure = xx - Math.random();
      decimalProcedure = Math.max(decimalProcedure, 0.1);
    } else if (procedure == 2) {
      xx = boardList[0].procedure;
      yy = boardList[1].procedure;
      console.log('dd');

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
    // id: number,
    boardId: number,
    createColumnDto: CreateColumnDto,
  ) {
    const title = createColumnDto.title;
    const procedure = createColumnDto.procedure;

    //보드가 존재하는지 확인
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('해당하는 보드가 존재하지 않습니다.');
    }

    const boards = await this.columnRepository.find({
      where: { boardId },
      select: ['id', 'procedure'],
    });

    const decimalProcedure = await this.boardList(boards, procedure);

    //컬럼 생성
    const column = await this.columnRepository.save({
      title,
      procedure: decimalProcedure,
      boardId,
    });
  }

  //컬럼 이름 수정
  async updateColumn(id: number, columnId: number, changeColumnDto: any) {
    const title = changeColumnDto.title;

    //컬럼 확인
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
    });

    if (!column) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }

    //보드에 권한이 있는지 확인
    // const isOwner = await this.boardMemberRepository.findOne({
    //   where: { userId: id, boardId: column.boardId },
    // });

    // if (isOwner.role !== Role.OWNER) {
    //   throw new UnauthorizedException('해당 보드에 권한이 없습니다.');
    // }

    const updateColumn = await this.columnRepository.update(
      { id: column.id },
      { title },
    );
  }

  //컬럼 삭제
  async deleteColumn(id: number, columnId: number) {
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
    columnId: number,
    changeProcedureDto: ChangeProcedureDto,
  ) {
    const procedure = changeProcedureDto.procedure;

    //컬럼 확인
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
    });
    console.log('컬럼은 찾았음', column);
    if (!column) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }

    const boards = await this.columnRepository.find({
      where: { boardId: column.boardId },
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

  async getcolumns(boardId: number) {
    const columns = await this.columnRepository.find({
      where: { boardId },
    });

    if (!columns) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }
    columns.sort((a, b) => a.procedure - b.procedure);

    return columns;
  }
}
