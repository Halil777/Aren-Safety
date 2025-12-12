import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { BillingStatus, Plan, TenantStatus } from "../tenant.entity";

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @IsOptional()
  @IsEnum(BillingStatus)
  billingStatus?: BillingStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  trialEndsAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paidUntil?: Date;

  @IsOptional()
  @IsEnum(Plan)
  plan?: Plan;
}
