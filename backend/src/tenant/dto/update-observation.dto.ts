import { IsOptional, IsString, IsNumber, IsDateString, Min, Max } from 'class-validator';

export class UpdateObservationDto {
  @IsOptional()
  @IsString()
  projectCode?: string;

  @IsOptional()
  @IsString()
  nameSurname?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  nonconformityType?: string;

  @IsOptional()
  @IsDateString()
  observationDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  riskLevel?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsString()
  task?: string;

  @IsOptional()
  @IsString()
  upperCategory?: string;

  @IsOptional()
  @IsString()
  lowerCategory?: string;

  @IsOptional()
  @IsString()
  description_en?: string;

  @IsOptional()
  @IsString()
  description_ru?: string;

  @IsOptional()
  @IsString()
  description_tr?: string;
}
