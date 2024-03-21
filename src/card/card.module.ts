import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
// import { AwsModule } from 'src/aws/aws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Columns } from 'src/column/entities/column.entity';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';
import { UtilsModule } from 'utils/utils.module';
import { Card } from './entitis/card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Columns, Board, BoardMember, Card]),
    // AwsModule,
    UtilsModule,
  ],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
