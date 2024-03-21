import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardRole } from './types/boardmember-role.type';

import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { BoardMember } from './entity/boardmembers.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private readonly boardRepo: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepo: Repository<BoardMember>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createBoard(user_id: number, createBoardDto: CreateBoardDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      queryRunner.connect();
      queryRunner.startTransaction();

      const newBoard = await queryRunner.manager
        .getRepository(Board)
        .save(createBoardDto);
      await queryRunner.manager.getRepository(BoardMember).save({
        board_id: newBoard.id,
        user_id: user_id,
        role: BoardRole.OWNER,
      });

      queryRunner.commitTransaction();

      return newBoard;
    } catch (err) {
      queryRunner.rollbackTransaction();
      queryRunner.release();
    }
  }

  async updateBoard(boardId: number, updateBoardDto: UpdateBoardDto) {
    const updatedBoard = await this.boardRepo.update(
      { id: +boardId },
      updateBoardDto,
    );

    return updatedBoard;
  }

  async deleteBoard(boardId: number, userId: number, password: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['password'],
    });

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }

    await this.boardRepo.delete({ id: +boardId });
  }

  async getBoardInfoByUserId(user_id: number) {
    return await this.boardMemberRepo.findBy({ user_id });
  }
}
