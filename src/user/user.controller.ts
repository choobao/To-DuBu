import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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

    @Post('login')
    async login(@Req() req, @Res({ passthrough: true }) res: Response) {
        const user = req.user;
        const {
          accessToken,
          ...accessOption
        } = this.userService.getCookieWithJwtAccessToken(user.id);
    
        const {
          refreshToken,
          ...refreshOption
        } = this.userService.getCookieWithJwtRefreshToken(user.id);
    
        await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    
        res.cookie('Authentication', accessToken, accessOption);
        res.cookie('Refresh', refreshToken, refreshOption);
    
        return user;
      }

    // @Post('login')
    // async login(@Body() loginDto: LoginDto) {
    //     return await this.userService.login(loginDto);
    // }

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

    // @Delete('unregister')
    // unregister(@Body() password: string) {
    //     return this.po
    // }
}
