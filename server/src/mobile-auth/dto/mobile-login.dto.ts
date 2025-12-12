import { IsString, Length } from 'class-validator';

export class MobileLoginDto {
  @IsString()
  @Length(3, 100)
  login: string;

  @IsString()
  @Length(6, 255)
  password: string;
}
