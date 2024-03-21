import { Board } from 'src/board/entity/board.entity';
import { Card } from 'src/card/entitis/card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'float', nullable: false })
  procedure: number;

  //Boards와 Columns는 1:N
  @ManyToOne(() => Board, (board) => board.columns)
  boards: Board;

  @Column('int', { name: 'boardId', nullable: false })
  boardId: number;

  //Column과 Cards는 1:N
  // @OneToMany(() => Cards, (card) => card.columnId)
  // card: Cards[];
}
