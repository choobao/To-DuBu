import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Column } from 'typeorm';
import { Columns } from './entities/column.entity';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { ColumnController } from './column.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Columns, Board, BoardMember])],
  providers: [ColumnService],
  controllers: [ColumnController],
  exports: [ColumnService],
})
export class ColumnModule {}
