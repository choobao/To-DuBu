import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from '../types/role.type';
import { Board } from './board.entity';

@Entity({ name: 'BoardMembers' })
export class BoardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { nullable: false })
  userId: number;

  @Column('bigint', { nullable: false })
  boardId: number;

  @Column()
  role: Role;

  @ManyToOne(() => Board, (board) => board.boardMembers)
  @JoinColumn({ name: 'boardId' })
  boards: Board;
}
