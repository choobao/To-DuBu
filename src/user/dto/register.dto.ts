import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  // Validate,
} from 'class-validator';
// import { IsDeletedEmailValidator } from '../decorator/is-email-not-soft-deleted.decorator';

export class RegisterDto {
  @IsEmail({}, { message: '이메일 형식을 확인해주세요.' })
  // @Validate(IsDeletedEmailValidator, { message: '탈퇴 처리된 이메일입니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @IsOptional()
  @IsString()
  company?: string;
}
