import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { createColumnDto } from './create.column.dto';
import { OmitType } from '@nestjs/mapped-types';

export class changeColumnDto extends OmitType(createColumnDto, ['procedure']) {}
//procedure 제외하고 dto를 받읍시다
