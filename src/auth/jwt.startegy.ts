import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Payload } from './jwt.payload';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    ) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더 Authentication 에서 Bearer 토큰으로부터 jwt를 추출함
      jwtFromRequest: ExtractJwt.fromExtractors([ // fromExtractors: 'passport-jwt' 모듈의 요청에서 JWT를 추출하는 방법을 구성
        (request) => {
          return request?.cookies?.Refresh;
        }
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  // async validate(payload: Payload & { exp: number }) {
  //   // TODO. payload로 전달된 데이터를 통해 실제 유저 정보를 조회해야 해요!
  //   const { id, email, exp } = payload;
  //   const expire = exp * 1000; // 만료기간

  //   if (id && email) {
  //     if (Date.now() < expire) {
  //       // 토큰 유효
  //       return { id, email };
  //     }
  //     // payload에 정보는 잘 있으나 token 만료
  //     throw new HttpException('토큰 만료', HttpStatus.UNAUTHORIZED);
  //   } else {
  //     // Payload에 정보가 없음
  //     throw new HttpException('접근 오류', HttpStatus.FORBIDDEN);
  //   }
  // }

  async validate(req, payload: any) {
    const refreshToken = req.cookies?.Refresh;
    return this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
  
  // async validate(payload: any) { // 해당 Refresh Token이 유효한지 확인하고 유효한 경우 유저 정보를 반환
  //   return this.usersService.findById(payload.id);
  // }
}
