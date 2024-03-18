import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'columns',
})
export class Columns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'string', nullable: false })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', nullable: false })
  procedure: number;

  //Boards와 Columns는 1:N
  // @ManyToOne(() => Boards, (board) => board.column)
  // board: Boards;

  // @Column({ type: 'int', nullable: false })
  // boardId:number;

  //Column과 Cards는 1:N
  // @OneToMany(() => Cards, (card) => card.columnId)
  // card: Cards[];
}
