import {
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

    //컬럼 순서 넣는 로직 작성
    //기본적으로 우선순위 1.1,2.2,3.3을 가진 컬럼이 존재한다고 가정(보드만들때 기본생성)
    //해당 보드의 컬럼 전부 가져와서 해당우선순위대로 정렬해서 리스트 작성
    //사용자가 입력한 우선순위에 해당하는 (가정: 2) 리스트 배열의 0 1번째 컬럼의 우선순위 가져오기
    //가져와서 그 우선순위로 나누기 = 2 그걸 우선순위로 넣어준다!
    const boardList = [];

    const boards = await this.columnRepository.find({
      where: { boardId },
      select: ['id', 'procedure'],
    });

    for (let i = 0; i < boards.length; i++) {
      boardList.push(boards[i]);
    }
    boardList.sort((a, b) => a.procedure - b.procedure);
    console.log(boardList);

    const xx = boardList[procedure - 1];
    const yy = boardList[procedure];
    console.log(xx, yy);

    let decimalProcedure = yy.procedure / xx.procedure;
    console.log(decimalProcedure);

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
  async changeColumnPriority(columnId: number, procedure: number) {
    //컬럼 확인
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
    });

    if (!column) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }

    const changePriority = await this.columnRepository.update(
      { id: column.id },
      { procedure },
    );
  }
}
