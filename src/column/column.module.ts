import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnController } from './column.controller';
import { User } from 'src/user/entities/user.entity';
import { Columns } from './entities/column.entity';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Columns, Board, BoardMember])],
  providers: [ColumnService],
  controllers: [ColumnController],
  exports: [ColumnService],
})
export class ColumnModule {}
