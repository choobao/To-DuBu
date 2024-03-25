import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateColumnDto } from './create.column.dto';
import { OmitType } from '@nestjs/mapped-types';

export class ChangeColumnDto extends OmitType(CreateColumnDto, ['procedure']) {}
//procedure 제외하고 dto를 받읍시다
