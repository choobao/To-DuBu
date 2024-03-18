import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardMember } from './boardMembers.entity';

@Entity({ name: 'Boards' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  description: string;

  @Column('varchar', { default: '[0, 0, 0]' })
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
