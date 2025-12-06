import { IsOptional, IsString } from 'class-validator';

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  projectCode?: string;

  @IsOptional()
  @IsString()
  title_en?: string;

  @IsOptional()
  @IsString()
  title_ru?: string;

  @IsOptional()
  @IsString()
  title_tr?: string;
}
