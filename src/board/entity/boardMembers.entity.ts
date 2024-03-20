import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BoardRole } from '../types/boardmember-role.type';
import { Board } from './board.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'BoardMembers' })
export class BoardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { nullable: false })
  userId: number;

  @Column('bigint', { nullable: false })
  boardId: number;

  @Column()
  role: BoardRole;

  @ManyToOne(() => Board, (board) => board.boardMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId' })
  boards: Board;

  @ManyToOne(() => User, (user) => user.boardMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  users: User;
}
