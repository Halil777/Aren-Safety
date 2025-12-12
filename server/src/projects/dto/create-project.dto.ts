import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  projectClient?: string;

  @IsOptional()
  @IsString()
  projectLocation?: string;

  @IsOptional()
  @IsString()
  projectHead?: string;
}
