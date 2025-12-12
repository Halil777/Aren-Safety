import { PartialType } from '@nestjs/mapped-types';
import { CreateObservationDto } from './create-observation.dto';
import { ObservationStatus } from '../observation-status';
import { IsEnum, IsOptional, IsDateString, IsString, Length } from 'class-validator';

export class UpdateObservationDto extends PartialType(CreateObservationDto) {
  @IsOptional()
  @IsEnum(ObservationStatus)
  status?: ObservationStatus;

  @IsOptional()
  @IsDateString()
  supervisorSeenAt?: string;

  @IsOptional()
  @IsDateString()
  fixedAt?: string;

  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2000)
  description?: string;
}
