import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TenantsService } from '../tenants/tenants.service';
import { BillingStatus, TenantStatus } from '../tenants/tenant.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private tenantsService: TenantsService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const tenant = await this.tenantsService.findByEmail(loginDto.email);

    if (!tenant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.tenantsService.ensureTenantAccessState(tenant);

    const isPasswordValid = await tenant.validatePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (tenant.status === TenantStatus.SUSPENDED || tenant.status === TenantStatus.DISABLED) {
      throw new UnauthorizedException('Account is not active');
    }

    const payload = {
      sub: tenant.id,
      email: tenant.email,
      status: tenant.status,
      billingStatus: tenant.billingStatus,
    };

    return {
      access_token: this.jwtService.sign(payload),
      tenant: {
        id: tenant.id,
        fullname: tenant.fullname,
        email: tenant.email,
        phoneNumber: tenant.phoneNumber,
        status: tenant.status,
        billingStatus: tenant.billingStatus,
        trialEndsAt: tenant.trialEndsAt,
        paidUntil: tenant.paidUntil,
        plan: tenant.plan,
      },
    };
  }

  async validateTenant(id: string) {
    const tenant = await this.tenantsService.findOne(id);
    await this.tenantsService.ensureTenantAccessState(tenant);

    if (tenant.status === TenantStatus.SUSPENDED || tenant.status === TenantStatus.DISABLED) {
      throw new UnauthorizedException('Account is not active');
    }

    return tenant;
  }
}
