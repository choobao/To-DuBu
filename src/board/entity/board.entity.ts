import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardMember } from './boardmembers.entity';
import { Columns } from 'src/column/entities/column.entity';

@Entity({ name: 'Boards' })
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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BoardMember, (member) => member.boards)
  boardMembers: BoardMember;

  // id => Column 1 : N
  @OneToMany(() => Columns, (column) => column.boards)
  columns: Columns[];
}
