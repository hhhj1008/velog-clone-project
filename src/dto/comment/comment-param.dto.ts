import { IsNumber, IsNotEmpty } from 'class-validator';

export class CommentParamDto {
  @IsNumber()
  @IsNotEmpty()
  comment_id: number;

  @IsNumber()
  @IsNotEmpty()
  post_id: number;
}
