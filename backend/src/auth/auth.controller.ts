import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, SUPERADMIN_TOKEN } from './constants';
import { StorageService } from '../storage/storage.service';
import { createHash } from 'crypto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly storage: StorageService) {}

  private hash(password: string): string {
    // simple sha256 hash for demo; replace with scrypt/bcrypt in production
    return createHash('sha256').update(password).digest('hex');
  }
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and return access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    const { login, password } = dto;
    // Super admin static
    if (login === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
      return {
        token: SUPERADMIN_TOKEN,
        refreshToken: null,
        user: {
          id: 'superadmin',
          email: SUPERADMIN_EMAIL,
          firstName: 'Super',
          lastName: 'Admin',
          isSuperAdmin: true,
          tenants: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // Tenant admin login
    const tenants = this.storage.readTenants();
    for (const tenant of tenants) {
      const admin = tenant.admins.find((a) => a.login === login);
      if (admin) {
        if (admin.passwordHash !== this.hash(password)) {
          throw new UnauthorizedException('Invalid credentials');
        }
        // Issue a simple token for demo; in real app, sign JWT
        const token = `tenant-token-${admin.id}`;
        return {
          token,
          refreshToken: null,
          user: {
            id: admin.id,
            email: admin.email || `${admin.login}@example.com`,
            firstName: admin.firstName,
            lastName: admin.lastName,
            isSuperAdmin: false,
            tenants: [
              {
                tenantId: tenant.id,
                tenantName: tenant.title,
                tenantSlug: tenant.slug,
                role: 'tenant_admin',
                isActive: true,
                invitedAt: admin.createdAt,
              },
            ],
            currentTenantId: tenant.id,
            createdAt: admin.createdAt,
            updatedAt: new Date().toISOString(),
          },
        };
      }
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
