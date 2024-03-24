import { BoardMember } from "src/board/entity/boardmembers.entity";
import { Columns } from "src/column/entities/column.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LexoRank } from "lexorank";
import { Comments } from "src/comment/entities/comment.entity";


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

  @Column({  type: 'int', nullable: false })
  user: number

  @Column({  type: 'int', nullable: false })
  columns_id: number

  @ManyToOne(() => BoardMember, (boardMember) => boardMember.card)
  @JoinColumn({ name: 'boardMember'})
  boardMember: BoardMember

  @ManyToOne(() => Columns, (columns) => columns.card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'columns_id'})
  columns: Columns

  @OneToMany(() => Comments, (comments) => comments.card)
  comments: Comments[];
  
  // @OneToMany(() => CheckLists, (checkLists) => checkLists.card)
  // checkLists: CheckLists
}