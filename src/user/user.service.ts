import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import * as uuid from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';

import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UnregisterDto } from './dto/unregister.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // private readonly isDeletedEmailValidator: IsDeletedEmailValidator,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
      withDeleted: true,
    });

    if (existingUser) {
      if (existingUser.deleted_at !== null) {
        // 기존에 등록된 사용자이면서 deleted_at이 null이 아닌(=탈퇴한) 사용자인지 확인
        throw new ConflictException('탈퇴 처리된 이메일입니다.'); // 탈퇴 처리된 메일로 가입을 시도하는 경우
      } else {
        throw new ConflictException( // 중복 가입을 시도하는 경우
          '이미 해당 이메일로 가입된 사용자가 있습니다.',
        );
      }
    }

    const hashedPassword = await hash(registerDto.password, 10); // 비크립트를 이용하여 비밀번호 10단계 해싱
    await this.userRepository.save({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      company: registerDto.company,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'], // 유저 엔터티에서 id, email, password 필드만 선택
      where: { email: loginDto.email }, // userRepository에서 제공된 이메일로 사용자 찾음
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    // 사용자가 일치하면 jwt 토큰 페이로드 구성
    const payload = { email: user.email, sub: user.id }; // 토큰 페이로드에 "sub" 필드를 포함하는 것은 토큰이 발행된 엔터티에 대한 정보를 제공하여 권한 부여 결정을 용이하게 하는 웹 서비스의 일반적인 관행
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
      },
    };
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

  // 유저 정보 조회
  async getInfo(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // 유저 정보 수정
  async updateInfo(id: number, data: Partial<User>): Promise<User> {
    // Partial<User>: User의 모든 속성을 포함하지만 각 속성은 선택 사항인 유형
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.update(id, data);
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    return updatedUser;
  }

  // 회원 탈퇴
  async unregister(
    unregisterDto: UnregisterDto,
    userId: number,
  ): Promise<boolean> {
    // 해당 작업이 완료될 때까지 기다리고 완료된 후에 불리언 값을 반환
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await compare(
      unregisterDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const result = await this.userRepository.softDelete(userId);

    return result.affected ? true : false; // result.affected는 삭제된 레코드의 수를 나타내며, 이 값이 0보다 크면(true) 삭제 작업이 성공적으로 수행되었음을 의미
  }

  async findByEmail(email: string, options?: { withDeleted?: boolean }) {
    // 검색 결과에 탈퇴한 사용자를 포함할지
    if (options && options.withDeleted) {
      // options 매개변수가 제공되었는지, withDeleted 속성이 true로 설정되었는지 확인
      return await this.userRepository.findOne({ where: { email } });
    }
    // options 매개변수가 제공되지 않거나 withDeleted 속성이 false(또는 제공되지 않음)인 경우 deleted_at 열이 null(=탈퇴하지 않은)인 사용자만 검색하여 탈퇴한 사용자를 검색 결과에서 제외
    return await this.userRepository.findOne({
      where: { email, deleted_at: null },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['password'],
    });
  }
}
