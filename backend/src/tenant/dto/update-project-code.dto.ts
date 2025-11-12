import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProjectCodeDto {
  @IsOptional()
  @IsString()
  code?: string;

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
  @IsString()
  client?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  headOfProject?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

