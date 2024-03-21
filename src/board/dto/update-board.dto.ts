import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @Length(6)
  @IsOptional()
  color: string;
}
