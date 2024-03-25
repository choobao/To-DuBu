import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class UserPasswordDto extends PickType(RegisterDto, ['password']) {}
