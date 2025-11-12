import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  title_en!: string;

  @IsString()
  @IsNotEmpty()
  title_ru!: string;

  @IsString()
  @IsNotEmpty()
  title_tr!: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

