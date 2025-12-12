import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsEmail()
  tenantEmail?: string;

  @IsOptional()
  @IsString()
  tenantName?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}
