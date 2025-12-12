import { IsString, IsUUID, Length } from 'class-validator';

export class CreateDepartmentDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @Length(2, 255)
  name: string;
}
