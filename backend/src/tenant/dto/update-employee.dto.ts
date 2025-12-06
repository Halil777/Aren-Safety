import { IsString, IsEmail, IsOptional, IsArray, IsNumber, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  relationship: string;

  @IsString()
  phone: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  employeeNumber?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  hireDate?: string;

  @IsOptional()
  @IsEnum(['active', 'on_leave', 'suspended', 'terminated'])
  status?: 'active' | 'on_leave' | 'suspended' | 'terminated';

  @IsOptional()
  @IsString()
  avatar?: string;

  // Safety-specific fields
  @IsOptional()
  @IsEnum(['worker', 'safety_team', 'inspector', 'head_of_safety'])
  safetyRole?: 'worker' | 'safety_team' | 'inspector' | 'head_of_safety';

  @IsOptional()
  @IsString()
  lastTrainingDate?: string;

  @IsOptional()
  @IsString()
  trainingExpiryDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsNumber()
  incidentCount?: number;

  @IsOptional()
  @IsNumber()
  observationsSubmitted?: number;

  // Contact & Emergency
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  // Location
  @IsOptional()
  @IsString()
  workLocation?: string;

  @IsOptional()
  @IsEnum(['day', 'night', 'rotating'])
  shift?: 'day' | 'night' | 'rotating';

  // Supervisor
  @IsOptional()
  @IsString()
  supervisorId?: string;

  // Inspector-specific
  @IsOptional()
  @IsString()
  licenseId?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsNumber()
  assignedSites?: number;

  @IsOptional()
  @IsString()
  lastAuditDate?: string;

  // Safety staff-specific
  @IsOptional()
  @IsString()
  expertise?: string;

  @IsOptional()
  @IsString()
  certificationLevel?: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;
}
