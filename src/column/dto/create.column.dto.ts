import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createColumnDto {
  @IsString()
  @IsNotEmpty({ message: '컬럼 이름을 입력해주세요.' })
  title: string;

  @IsNumber()
  @IsNotEmpty({ message: '작업 순서를 입력해주세요.' })
  procedure: number;
}
