import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { BillingStatus, Plan, TenantStatus } from "../tenant.entity";

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

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
