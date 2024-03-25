import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardMember } from './boardmembers.entity';
import { Columns } from '../../column/entities/column.entity';

@Entity({ name: 'boards' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  description: string;

  @Column('varchar', { length: 6, default: '000000' })
  color: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => BoardMember, (member) => member.boards, {
    onDelete: 'NO ACTION',
  })
  board_member: BoardMember[];

  @OneToMany(() => Columns, (column) => column.boards, {
    onDelete: 'NO ACTION',
  })
  columns: Columns[];
}
