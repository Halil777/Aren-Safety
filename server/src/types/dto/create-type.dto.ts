import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateTypeDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @Length(2, 255)
  typeName: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;
}
