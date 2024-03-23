import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { UserInfo } from 'utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { UnregisterDto } from './dto/unregister.dto';

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

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.userService.login(loginDto);
    res.cookie('Authorization', token, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    });
    return token;
  }

  @UseGuards(AuthGuard('jwt')) // JWT 인증이 된 유저에 한해서 해당 API를 호출하게 해주는 데코레이터
  @Get('getinfo')
  getInfo(@UserInfo() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('updateinfo')
  async updateInfo(@UserInfo() user: User, @Body() updateData: Partial<User>) {
    const updatedUser = await this.userService.updateInfo(user.id, updateData);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      company: updatedUser.company,
    };
  }

  @Patch('unregister') // softDelete라서 @Delete X
  @UseGuards(AuthGuard('jwt'))
  async unregister(
    @Body() unregisterDto: UnregisterDto,
    @UserInfo() user: User,
  ) {
    await this.userService.unregister(unregisterDto, user.id);
  }
}
