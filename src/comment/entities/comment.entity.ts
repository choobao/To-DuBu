import { Board } from 'src/board/entity/board.entity';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'comments',
})
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @CreateDateColumn()
  created_At: Date;

  //user과 comments는 1:N
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  //cards와 comments는 1:N
  @ManyToOne(() => Card, (card) => card.comments)
  @JoinColumn({ name: 'card_id' })
  card: Card;
}
