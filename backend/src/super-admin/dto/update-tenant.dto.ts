import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
