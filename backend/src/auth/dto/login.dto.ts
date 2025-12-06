import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@safety.com', description: 'Login email or username' })
  @IsString()
  login!: string;

  @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
