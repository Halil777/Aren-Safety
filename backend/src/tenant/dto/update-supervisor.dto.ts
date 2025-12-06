import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class UpdateSupervisorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectIds?: string[];

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  department?: string;
}
