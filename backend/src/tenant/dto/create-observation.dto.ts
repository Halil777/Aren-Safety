import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateObservationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  projectCode!: string;

  @IsString()
  @IsNotEmpty()
  nameSurname!: string;

  @IsString()
  @IsNotEmpty()
  department!: string;

  @IsString()
  @IsNotEmpty()
  nonconformityType!: string;

  @IsDateString()
  @IsNotEmpty()
  observationDate!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  riskLevel!: number;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsNotEmpty()
  deadline!: string;

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

