import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @Length(6)
  @IsOptional()
  color: string;
}
