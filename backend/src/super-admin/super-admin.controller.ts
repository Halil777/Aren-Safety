import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantRecord } from '../shared/types';
import { SuperAdminGuard } from '../auth/super-admin.guard';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateTenantAdminDto } from './dto/create-tenant-admin.dto';
import { createHash } from 'crypto';

@UseGuards(SuperAdminGuard)
@Controller('super-admin/tenants')
export class SuperAdminController {
  constructor(private readonly storage: StorageService) {}

  private hash(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  @Get()
  list(): TenantRecord[] {
    return this.storage.readTenants();
  }

  @Get(':id')
  get(@Param('id') id: string): TenantRecord | undefined {
    return this.storage.readTenants().find((t) => t.id === id);
  }

  @Post()
  create(@Body() dto: CreateTenantDto): TenantRecord {
    const tenants = this.storage.readTenants();
    if (tenants.some((t) => t.slug === dto.slug)) {
      // naive conflict handling: change slug by suffix
      dto.slug = `${dto.slug}-${Math.floor(Math.random() * 1000)}`;
    }
    const now = new Date().toISOString();
    const newTenant: TenantRecord = {
      id: randomUUID(),
      slug: dto.slug,
      title: dto.title,
      createdAt: now,
      updatedAt: now,
      admins: [],
    };
    // Optional inline admin create with credentials
    if (dto.adminLogin && dto.adminPassword && dto.adminFirstName && dto.adminLastName) {
      newTenant.admins.push({
        id: randomUUID(),
        login: dto.adminLogin,
        email: dto.adminEmail,
        firstName: dto.adminFirstName,
        lastName: dto.adminLastName,
        passwordHash: this.hash(dto.adminPassword),
        createdAt: now,
      });
    }
    tenants.push(newTenant);
    this.storage.writeTenants(tenants);
    return newTenant;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto): TenantRecord | undefined {
    const tenants = this.storage.readTenants();
    const idx = tenants.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    const prev = tenants[idx];
    tenants[idx] = {
      ...prev,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.storage.writeTenants(tenants);
    return tenants[idx];
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const tenants = this.storage.readTenants();
    const filtered = tenants.filter((t) => t.id !== id);
    this.storage.writeTenants(filtered);
    return { deleted: tenants.length - filtered.length };
  }

  @Post(':id/admins')
  createAdmin(@Param('id') id: string, @Body() dto: CreateTenantAdminDto) {
    const tenants = this.storage.readTenants();
    const tenant = tenants.find((t) => t.id === id);
    if (!tenant) return { error: 'Tenant not found' };
    const now = new Date().toISOString();
    const admin = {
      id: randomUUID(),
      login: dto.login,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: this.hash(dto.password),
      createdAt: now,
    };
    tenant.admins.push(admin);
    tenant.updatedAt = now;
    this.storage.writeTenants(tenants);
    return admin;
  }
}
