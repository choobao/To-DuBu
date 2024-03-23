import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { BoardMember } from './entity/boardmembers.entity';
import { User } from 'src/user/entities/user.entity';
import { MailModule } from 'src/email/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardMember, User]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('MAILER_TOKEN_KEY'),
      }),
      inject: [ConfigService],
    }),
    MailModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}