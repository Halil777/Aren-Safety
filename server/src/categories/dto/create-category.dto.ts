import { IsString, IsUUID, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @Length(2, 255)
  categoryName: string;
}
