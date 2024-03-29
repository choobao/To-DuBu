import { Board } from 'src/board/entity/board.entity';
import { Card } from 'src/card/entities/card.entity';
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
  name: 'columns',
})
export class Columns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'float', nullable: false })
  procedure: number;

  //Boards와 Columns는 1:N
  @ManyToOne(() => Board, (board) => board.columns)
  boards: Board;

  @Column('int', { name: 'board_id', nullable: false })
  board_id: number;

  //Column과 Cards는 1:N
  @OneToMany(() => Card, (card) => card.columns)
  card: Card[];
}
