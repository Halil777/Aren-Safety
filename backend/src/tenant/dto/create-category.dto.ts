import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  projectCode!: string;

  @IsString()
  @IsNotEmpty()
  title_en!: string;

  @IsString()
  @IsNotEmpty()
  title_ru!: string;

  @IsString()
  @IsNotEmpty()
  title_tr!: string;
}
