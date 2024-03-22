import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { UserService } from 'src/user/user.service';
// import { BoardService } from 'src/board/board.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    // private readonly boardService: BoardService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: any) {
    // typeorm repo 에서 셀렉트
    const user = await this.userService.findByEmail(payload.email);
    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }
    // user['boardInfo'] = await this.boardService.getBoardInfoByUserId(user.id);
    return user;
  }
}
