import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateComment {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1)
  depth: number;
}
