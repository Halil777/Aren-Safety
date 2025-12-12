import { IsBoolean, IsEnum, IsString, IsUUID } from 'class-validator';
import { ObservationMediaType } from '../observationMedia.entity';

export class CreateObservationMediaDto {
  @IsEnum(ObservationMediaType)
  type: ObservationMediaType;

  @IsString()
  url: string;

  @IsUUID()
  uploadedByUserId: string;

  @IsBoolean()
  isCorrective: boolean;
}
