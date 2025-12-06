import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserRoleDto {
  @IsNotEmpty()
  @IsString()
  name_en: string;

  @IsNotEmpty()
  @IsString()
  name_ru: string;

  @IsNotEmpty()
  @IsString()
  name_tr: string;
}
