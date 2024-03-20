import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    // const user = await this.userService.findByEmail(payload.email);
    // //유저만 찾는게 아니라, 유저가 가지고 있는 보드멤버까지 같이 넣기
    // if (_.isNil(user)) {
    //   throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    // }
    // //멤버보드아이디같이
    // return { user, memberBoardId };
  }
}
