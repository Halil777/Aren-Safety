import { IsArray, IsEnum, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObservationMediaType } from '../observationMedia.entity';

class AnswerMediaDto {
  @IsEnum(ObservationMediaType)
  type: ObservationMediaType;

  @IsString()
  url: string;

  @IsOptional()
  isCorrective?: boolean;
}

export class AnswerObservationDto {
  @IsOptional()
  @IsString()
  @Length(2, 2000)
  answer?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerMediaDto)
  media?: AnswerMediaDto[];
}
