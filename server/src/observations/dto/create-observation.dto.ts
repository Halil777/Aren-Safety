import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObservationStatus } from '../observation-status';
import { ObservationMediaType } from '../observationMedia.entity';

class ObservationMediaInputDto {
  @IsEnum(ObservationMediaType)
  type: ObservationMediaType;

  @IsString()
  url: string;

  @IsOptional()
  isCorrective?: boolean;
}

export class CreateObservationDto {
  @IsOptional()
  @IsUUID()
  createdByUserId?: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  locationId?: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsUUID()
  subcategoryId?: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsUUID()
  supervisorId: string;

  @IsString()
  @Length(2, 255)
  workerFullName: string;

  @IsString()
  @Length(2, 255)
  workerProfession: string;

  @IsInt()
  @Min(1)
  @Max(5)
  riskLevel: number;

  @IsString()
  @Length(2, 2000)
  description: string;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsEnum(ObservationStatus)
  status?: ObservationStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObservationMediaInputDto)
  media?: ObservationMediaInputDto[];
}
