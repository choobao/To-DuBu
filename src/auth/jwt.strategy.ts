import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { BoardMember } from 'src/board/entity/boardmembers.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepo: Repository<BoardMember>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  private static extractJWT(req: RequestType): string | null {
    const { Authorization } = req.cookies;
    if (Authorization) {
      const [tokenType, token] = Authorization.split(' ');
      if (tokenType !== 'Bearer')
        throw new BadRequestException('토큰 타입이 일치하지 않습니다.');
      if (!token) {
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }
      return token;
    }
    return null;
  }

  async validate(payload: any) {
    const user = await this.userRepo.findOneBy({ email: payload.email });
    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }
    user['boardInfo'] = await this.boardMemberRepo.findBy({ user_id: user.id });

    return user;
  }
}
