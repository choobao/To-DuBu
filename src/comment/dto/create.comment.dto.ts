import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글을 입력해주세요.' })
  content: string;
}
