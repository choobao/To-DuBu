import { Transform } from "class-transformer"
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  color: string

  @IsNotEmpty()
  @IsDateString()
  dead_line: string

  @IsNotEmpty()
  @IsNumber()
  columnId: number;

  // @IsOptional()
  // @IsString()
  // image_url?: string
}