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
import { Exclude } from 'class-transformer';

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
  company?: string;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;

  @Column({ nullable: true }) // Refresh Token은 로그아웃시 Null 이 되기 때문에 Null값을 허용
  @Exclude() // 특정 작업을 수행할 때 해당 특정 속성을 무시하도록 ORM 프레임워크에 지시
  currentHashedRefreshToken?: string;

  // 댓글
  // @OneToMany(() => Comment, (comment) => comment.user)
  // comment: comment[];

  // @OneToMany(() => BoardMember, (boardMember) => boardMember.user)
  // boardMember: BoardMember;
}