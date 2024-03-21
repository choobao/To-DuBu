import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { UserInfo } from 'utils/userInfo.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return await this.userService.register(registerDto);
    }

    // 노드메일러에 필요한 메일 코드
    // @Post('email-verify')
    // async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    //     const { signupVerifyToken } = verifyEmailDto;
    //     return await this.userService.verifyEmail(signupVerifyToken);
    // }
    
    // @Post('login')
    // async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    //     const user = await this.userService.login(loginDto);

    //     if (!user) {
    //       throw new UnauthorizedException('로그인에 실패했습니다.');
    //   }
    //     const {
    //         accessToken,
    //         refreshToken,
    //         ...cookieOptions
    //     } = this.userService.getCookiesForUser(user.id);

    //     res.cookie('Authentication', accessToken, cookieOptions);
    //     res.cookie('Refresh', refreshToken, cookieOptions);

    //     return user;
    //   }

    @Post('login')
    async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) res: Response,) {
        const token = await this.userService.login(loginDto.email, loginDto.password);
        res.cookie('Authentication', token, {
          domain: 'localhost',
          path: '/',
          httpOnly: true,
        })
        return token;
    }

    @UseGuards(AuthGuard('jwt')) // JWT 인증이 된 유저에 한해서 해당 API를 호출하게 해주는 데코레이터
    @Get('info')
    getInfo(@UserInfo() user: User) {
        return { id: user.id, email: user.email, name: user.name, role: user.role };
    }

//     @Get()
//   @UseGuards(JwtAuthGuard)
//   async getData(@Req() req) {
//     const { id, email } = req.user;
//     const user = await this.userService.findUserById({ id });
    
//     // ... 원하는 로직 수행 return
//   }

// 작성하다 만 회원탈퇴 로직
    // @Delete('unregister')
    // unregister(@Body() password: string) {
    //     return this.po
    // }
}
