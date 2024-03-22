import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateCardDto {
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
  dead_line: string

  @IsOptional()
  @IsString()
  image_url: string
}