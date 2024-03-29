import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { ColumnModule } from './column/column.module';
import { Card } from './card/entities/card.entity';
import { User } from './user/entities/user.entity';
import { Columns } from './column/entities/column.entity';
import Joi from 'joi';
import { Board } from './board/entity/board.entity';
import { BoardMember } from './board/entity/boardmembers.entity';
import { CommentModule } from './comment/comment.module';
import { Comments } from './comment/entities/comment.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, Card, Columns, Board, BoardMember, Comments],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // JWT_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        HOST: Joi.string().required(),
        PORT: Joi.number().required(),
        MAILER_ID: Joi.string().required(),
        MAILER_PASSWORD: Joi.string().required(),
        MAILER_TOKEN_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    BoardModule,
    CardModule,
    ColumnModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
