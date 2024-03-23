import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { Comments } from 'src/comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'cards',
})
export class Card {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'int', nullable: false })
  priority: number;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @Column({ nullable: true })
  deadLine: Date;

  @Column()
  user: number;

  // @Column()
  // columnId: number;

  // TODO : 상대 테이블에 따라서 수정 요함.
  // @ManyToOne(() => BoardMember, (boardMember) => boardMember.card)
  // boardMember: BoardMember;

  // @OneToMany(() => CheckLists, (checkLists) => checkLists.card)
  // checkLists: CheckLists;

  @OneToMany(() => Comments, (comments) => comments.card)
  comments: Comments[];
}
