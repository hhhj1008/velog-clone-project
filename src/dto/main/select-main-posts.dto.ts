import { IsEnum, IsOptional } from 'class-validator';
import { MainPostsType, PeriodType } from 'src/main/main.model';

export class SelectMainPostsDto {
  @IsEnum(MainPostsType)
  type: MainPostsType;

  @IsOptional()
  @IsEnum(PeriodType)
  period: PeriodType;
}
