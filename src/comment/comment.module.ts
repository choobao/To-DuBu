import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/card/entitis/card.entity';
import { Comments } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Comments])],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
