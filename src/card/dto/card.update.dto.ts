import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  color: string

  @IsOptional()
  dead_line: string

  @IsOptional()
  @IsString()
  image_url: string
}