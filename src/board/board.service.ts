import _ from 'lodash';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardRole } from './types/boardmember-role.type';

import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { BoardMember } from './entity/boardmembers.entity';
import { User } from 'src/user/entities/user.entity';
import { MailService } from 'src/email/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private readonly boardRepo: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepo: Repository<BoardMember>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async createBoard(userId: number, createBoardDto: CreateBoardDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      queryRunner.connect();
      queryRunner.startTransaction();

      const newBoard = await queryRunner.manager
        .getRepository(Board)
        .save(createBoardDto);
      await queryRunner.manager.getRepository(BoardMember).save({
        board_id: newBoard.id,
        user_id: userId,
        role: BoardRole.OWNER,
      });

      queryRunner.commitTransaction();

      return newBoard;
    } catch (err) {
      queryRunner.rollbackTransaction();
      queryRunner.release();
    }
  }

  async findAllBoards() {
    return this.boardRepo.find({ select: ['id', 'title', 'description'] });
  }

  async findBoard(boardId: number) {
    return this.boardRepo.findOneBy({ id: boardId });
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

  async getBoardInfoByUserId(userId: number) {
    return await this.boardMemberRepo.findBy({ user_id: userId });
  }

  async inviteMember(boardId: number, email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id'],
    });
    if (_.isNil(user))
      throw new NotFoundException('해당하는 유저가 존재하지 않습니다.');

    const existingMember = await this.boardMemberRepo.findBy({
      user_id: user.id,
    });

    if (!_.isEmpty(existingMember.filter((bm) => bm.board_id === boardId)))
      throw new ConflictException(
        '이미 초대했거나 현재 보드에 참여중인 유저입니다.',
      );

    const emailToken = this.jwtService.sign(
      { boardId, userId: user.id },
      { expiresIn: '3d', secret: 'MAILER_TOKEN_KEY' },
    );

    await this.mailService.sendInvitationMail(email, emailToken);
    this.boardMemberRepo.save({
      board_id: boardId,
      user_id: user.id,
      role: BoardRole.INVITED,
    });
  }

  async acceptInvitation(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: 'MAILER_TOKEN_KEY',
    });

    const invitedMember = await this.boardMemberRepo.findOne({
      where: {
        user_id: payload.userId,
        board_id: payload.boardId,
      },
    });

    if (_.isNil(invitedMember))
      throw new BadRequestException('잘못된 접근입니다.');

    if (invitedMember.role === BoardRole.INVITED) {
      await this.boardMemberRepo.update(invitedMember.id, {
        role: BoardRole.WORKER,
      });
    } else {
      throw new ConflictException('이미 해당 보드에 참여중인 유저입니다.');
    }
  }
}
