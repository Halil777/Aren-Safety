import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
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
