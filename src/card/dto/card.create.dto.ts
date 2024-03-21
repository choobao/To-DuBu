import { Transform } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

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
  @IsString()
  // @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dead_line: string

  // @IsOptional()
  // @IsString()
  // image_url?: string
}