import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @Length(2, 255)
  companyName: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;
}
