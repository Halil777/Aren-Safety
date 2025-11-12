import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  // Optional inline admin creation
  @IsOptional()
  adminLogin?: string;
  @IsOptional()
  adminPassword?: string;
  @IsOptional()
  adminEmail?: string;
  @IsOptional()
  adminFirstName?: string;
  @IsOptional()
  adminLastName?: string;
}
