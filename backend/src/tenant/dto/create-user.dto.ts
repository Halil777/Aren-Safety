import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'SecurePass123', description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: ['admin', 'manager', 'user', 'viewer'], example: 'user', description: 'User role' })
  @IsOptional()
  @IsEnum(['admin', 'manager', 'user', 'viewer'])
  role?: 'admin' | 'manager' | 'user' | 'viewer';

  @ApiPropertyOptional({ example: 'Engineering', description: 'Department name' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Safety Inspector', description: 'Job position' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: true, description: 'User active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00Z', description: 'Last login timestamp' })
  @IsOptional()
  @IsString()
  lastLogin?: string;
}
