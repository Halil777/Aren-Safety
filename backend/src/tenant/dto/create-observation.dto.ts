import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateObservationDto {
  @ApiPropertyOptional({ example: 'uuid-123', description: 'Optional custom ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'PRJ-001', description: 'Project code' })
  @IsString()
  @IsNotEmpty()
  projectCode!: string;

  @ApiProperty({ example: 'John Doe', description: 'Observer name and surname' })
  @IsString()
  @IsNotEmpty()
  nameSurname!: string;

  @ApiProperty({ example: 'Construction', description: 'Department name' })
  @IsString()
  @IsNotEmpty()
  department!: string;

  @ApiProperty({ example: 'Safety Violation', description: 'Type of nonconformity' })
  @IsString()
  @IsNotEmpty()
  nonconformityType!: string;

  @ApiProperty({ example: '2025-01-15T10:30:00Z', description: 'Date of observation' })
  @IsDateString()
  @IsNotEmpty()
  observationDate!: string;

  @ApiProperty({ example: 3, description: 'Risk level from 1 to 5', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  riskLevel!: number;

  @ApiProperty({ example: 'Open', description: 'Current status' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({ example: '2025-02-01', description: 'Deadline for resolution' })
  @IsString()
  @IsNotEmpty()
  deadline!: string;

  @ApiPropertyOptional({ example: 'Fix immediately', description: 'Task description' })
  @IsOptional()
  @IsString()
  task?: string;

  @ApiPropertyOptional({ example: 'Safety Equipment', description: 'Upper category' })
  @IsOptional()
  @IsString()
  upperCategory?: string;

  @ApiPropertyOptional({ example: 'Helmets', description: 'Lower category' })
  @IsOptional()
  @IsString()
  lowerCategory?: string;

  @ApiPropertyOptional({ example: 'Worker not wearing helmet', description: 'Description in English' })
  @IsOptional()
  @IsString()
  description_en?: string;

  @ApiPropertyOptional({ example: 'Рабочий не носит каску', description: 'Description in Russian' })
  @IsOptional()
  @IsString()
  description_ru?: string;

  @ApiPropertyOptional({ example: 'İşçi kask takmıyor', description: 'Description in Turkish' })
  @IsOptional()
  @IsString()
  description_tr?: string;

  @ApiPropertyOptional({ example: 'uuid-supervisor-123', description: 'Assigned supervisor ID' })
  @IsOptional()
  @IsString()
  supervisorId?: string;
}

