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

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  // @OneToMany
  // 작성 예정

}