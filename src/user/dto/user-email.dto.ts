import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class UserEmailDto extends PickType(RegisterDto, ['email']) {}
