import { IsDateString, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateTaskDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  @Length(2, 255)
  taskName: string;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;
}
