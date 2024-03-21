import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as uuid from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';

import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다.',
      );
    }

    const hashedPassword = await hash(registerDto.password, 10); // 비크립트를 이용하여 비밀번호 10단계 해싱
    await this.userRepository.save({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      company: registerDto.company,
    });
  }

  // 기존 토큰 반환만 하는 로그인 로직
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id }; // 토큰 페이로드에 "sub" 필드를 포함하는 것은 토큰이 발행된 엔터티에 대한 정보를 제공하여 권한 부여 결정을 용이하게 하는 웹 서비스의 일반적인 관행
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '300s' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  // // access token
  // getCookieWithJwtAccessToken(id: number) {
  //   const payload = { id }; // 유저 id가 포함된 페이로드 객체 생성
  //   const token = this.jwtService.sign(payload, { // JWT 서비스를 사용하여 토큰을 서명
  //     secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'), // configService를 통해 JWT 액세스 토큰의 서명에 사용되는 비밀키를 가져옴
  //     expiresIn: `${this.configService.get( // configService를 통해 JWT 액세스 토큰 만료 시간 설정
  //       'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
  //     )}s`, // 시간 표기
  //   });

  //   // 생성된 토큰을 쿠키 정보와 함께 반환
  //   return {
  //     accessToken: token,
  //     domain: 'localhost',
  //     path: '/', // 쿠키의 경로를 나타냄. '/'로 설정되어 있으므로 이 쿠키는 사이트 전체에서 사용 가능
  //     httpOnly: true, // 브라우저에서 스크립트를 통해 쿠키에 접근하는 것을 방지하기 위해 설정
  //     maxAge: Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) * 1000, // JWT 액세스 토큰의 만료 시간(JWT_ACCESS_TOKEN_EXPIRATION_TIME)을 밀리초 단위로 변환하여 쿠키의 만료 시간으로 할당
  //   };
  // }

  // // refresh token
  // getCookieWithJwtRefreshToken(id: number) {
  //   const payload = { id };
  //   const token = this.jwtService.sign(payload, {
  //     secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
  //     expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME',
  //     )}s`,
  //   });

  //   return {
  //     refreshToken: token,
  //     domain: 'localhost',
  //     path: '/',
  //     httpOnly: true,
  //     maxAge:
  //       Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) * 1000,
  //   };
  // }

  // 로그아웃
  // 로그아웃 요청이 오면 현재 쿠키에 빈 쿠키를 기입하기 위한 값들을 반환합니다. 추후 저장될 쿠키는 Authentication, Refresh 두가지 이므로 두가지에 해당되는 쿠키 옵션들을 반환해
  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      }
    }
  }

  // DB에 발급받은 Refresh Token을 암호화 하여 저장
  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);
    await this.userRepository.update(id, { currentHashedRefreshToken });
  }

  // 유저의 고유 번호를 이용하여 데이터를 조회하고 Refresh Token이 유효한지 확인
  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.findById(id);

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  // Refresh Token의 값을 Null -> 로그아웃
  async removeRefreshToken(id: number) {
    return this.userRepository.update(id, {
      currentHashedRefreshToken: null,
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  // async unregister
}
