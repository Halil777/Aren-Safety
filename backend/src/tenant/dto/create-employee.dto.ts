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

export class CreateEmployeeDto {
  @IsString()
  employeeNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  position: string;

  @IsString()
  department: string;

  @IsString()
  hireDate: string;

  @IsEnum(['active', 'on_leave', 'suspended', 'terminated'])
  status: 'active' | 'on_leave' | 'suspended' | 'terminated';

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

  @IsArray()
  @IsString({ each: true })
  certifications: string[];

  @IsNumber()
  incidentCount: number;

  @IsNumber()
  observationsSubmitted: number;

  // Contact & Emergency
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  // Location
  @IsString()
  workLocation: string;

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
