import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateColumnDto } from './create.column.dto';
import { OmitType } from '@nestjs/mapped-types';

export class ChangeProcedureDto extends OmitType(CreateColumnDto, ['title']) {}
