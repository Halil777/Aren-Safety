import { IsString, IsUUID, Length } from 'class-validator';

export class CreateSubcategoryDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  @Length(2, 255)
  subcategoryName: string;
}
