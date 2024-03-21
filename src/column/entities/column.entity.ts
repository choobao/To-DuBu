import { Board } from 'src/board/entity/board.entity';
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

  @Column({ type: 'int', nullable: false })
  procedure: number;

  //Boards와 Columns는 1:N
  @ManyToOne(() => Board, (board) => board.columns)
  boards: Board;

  @Column({ type: 'int', nullable: false })
  boardId: number;

  //Column과 Cards는 1:N
  // @OneToMany(() => Cards, (card) => card.columnId)
  // card: Cards[];
}
