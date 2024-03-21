import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty({ message: '컬럼 이름을 입력해주세요.' })
  title: string;

  @IsNumber()
  @Min(1, { message: '1 이상을 입력해주세요.' })
  @IsNotEmpty({ message: '작업 순서를 입력해주세요.' })
  procedure: number;
}
