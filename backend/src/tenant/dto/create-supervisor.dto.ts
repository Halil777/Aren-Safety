import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class CreateSupervisorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  position: string;

  @IsArray()
  @IsString({ each: true })
  projectIds: string[];

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  department?: string;
}
