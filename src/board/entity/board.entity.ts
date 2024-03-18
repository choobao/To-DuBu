import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardMember } from './boardmembers.entity';

@Entity({ name: 'Boards' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  description: string;

  @Column('string', { length: 6, default: '000000' })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BoardMember, (member) => member.boards)
  boardMembers: BoardMember;

  // id => Column 1 : N
  //   @OneToMany(() => Column, (column) => column.boards)
  //   columns: Column;
}
