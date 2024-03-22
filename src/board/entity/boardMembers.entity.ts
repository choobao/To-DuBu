import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardRole } from '../types/boardmember-role.type';
import { Board } from './board.entity';
import { User } from 'src/user/entities/user.entity';
import { Card } from 'src/card/entities/card.entity';

@Entity({ name: 'board_member' })
export class BoardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { nullable: false })
  user_id: number;

  @Column('bigint', { nullable: false })
  board_id: number;

  @Column()
  role: BoardRole;

  @ManyToOne(() => Board, (board) => board.board_member, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  boards: Board;

  @ManyToOne(() => User, (user) => user.board_member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  users: User;
  
  @CreateDateColumn()
  created_at: Date;
  
    @OneToMany(() => Card, (card) => card.boardMember)
    card: Card[]
}
