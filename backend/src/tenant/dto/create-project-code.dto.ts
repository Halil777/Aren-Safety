import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectCodeDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  title_en!: string;

  @IsString()
  @IsNotEmpty()
  title_ru!: string;

  @IsString()
  @IsNotEmpty()
  title_tr!: string;

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

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

