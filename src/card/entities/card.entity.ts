import { BoardMember } from "src/board/entity/boardmembers.entity";
import { Columns } from "src/column/entities/column.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LexoRank } from "lexorank";


@Entity({
  name: 'card'
})

export class Card {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'varchar', nullable: false  })
  title: string

  @Column({ type: 'varchar', nullable: false})
  description: string

  @Column({ type: 'varchar', nullable: false, default: '000000'})
  color: string
  
  @Column({ type: 'varchar', nullable: false })
  dead_line: Date

  @Column( {type: 'varchar', nullable: true })
  image_url: string
  
  @CreateDateColumn({ update: false })
  created_at: Date
  
  @UpdateDateColumn()
  updated_at: Date
  
  @Column({ type: 'varchar', nullable: false })
  lexo: LexoRank
// TODO : 상대 테이블에 따라서 수정 요함.
  @ManyToOne(() => BoardMember, (boardMember) => boardMember.card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user'})
  boardMember: BoardMember

  @ManyToOne(() => Columns, (columns) => columns.card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'columns'})
  columns: Columns

  // @OneToMany(() => CheckLists, (checkLists) => checkLists.card)
  // checkLists: CheckLists
}