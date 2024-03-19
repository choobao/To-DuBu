import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
        return await this.userService.register(registerDto.email, registerDto.password, registerDto.name, registerDto.company);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.userService.login(loginDto.email, loginDto.password);
    }

    @UseGuards(AuthGuard('jwt')) // JWT 인증이 된 유저에 한해서 해당 API를 호출하게 해주는 데코레이터
    @Get('info')
    getInfo(@UserInfo() user: User) {
        return { id: user.id, email: user.email, name: user.name, role: user.role };
    }
}
