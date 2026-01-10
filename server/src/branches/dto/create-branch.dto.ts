import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateBranchDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;
}
