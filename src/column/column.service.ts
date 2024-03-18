import { Injectable, NotFoundException } from '@nestjs/common';
import { Columns } from './entities/column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from 'src/board/entity/board.entity';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  //컬럼 생성
  async createColumn(id: number, title: string, procedure: number) {
    const board = await this.boardRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException('해당하는 보드가 존재하지 않습니다.');
    }

    const column = await this.columnRepository.save({
      title,
      procedure,
      boardId: id,
    });
  }

  //컬럼 이름 수정
  async updateColumn(id: number, title: string) {
    const column = await this.columnRepository.findOne({
      where: { id },
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
  async deleteColumn(id: number) {
    const column = await this.columnRepository.findOne({
      where: { id },
    });

    if (!column) {
      throw new NotFoundException('해당하는 컬럼이 존재하지 않습니다.');
    }

    const updateColumn = await this.columnRepository.delete({ id: column.id });
  }

  //컬럼 순서 이동
}
