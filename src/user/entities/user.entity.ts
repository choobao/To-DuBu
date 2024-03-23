import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { Comments } from 'src/comment/entities/comment.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @IsString()
  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @IsString()
  @Column({ type: 'varchar', unique: false, nullable: false })
  name: string;

  @IsString()
  @Column({ type: 'varchar', unique: false, nullable: true })
  company: string;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @OneToMany(() => BoardMember, (board_member) => board_member.users)
  board_member: BoardMember;

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];
}
