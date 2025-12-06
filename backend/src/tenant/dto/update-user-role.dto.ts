import { IsString, IsOptional } from 'class-validator';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsString()
  name_en?: string;

  @IsOptional()
  @IsString()
  name_ru?: string;

  @IsOptional()
  @IsString()
  name_tr?: string;
}
