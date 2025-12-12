import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { MobileRole } from '../mobile-role';

export class CreateMobileAccountDto {
  @IsString()
  @Length(2, 255)
  fullName: string;

  @IsString()
  @Length(3, 50)
  phoneNumber: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @Length(3, 100)
  login: string;

  @IsString()
  @Length(6, 255)
  password: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  profession?: string;

  @IsOptional()
  @IsEnum(MobileRole)
  role?: MobileRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  projectIds: string[];
}
