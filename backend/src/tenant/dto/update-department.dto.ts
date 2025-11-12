import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  title_en?: string;

  @IsOptional()
  @IsString()
  title_ru?: string;

  @IsOptional()
  @IsString()
  title_tr?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

