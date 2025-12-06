import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantRecord } from '../shared/types';
import { SuperAdminGuard } from '../auth/super-admin.guard';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateTenantAdminDto } from './dto/create-tenant-admin.dto';
import { createHash } from 'crypto';

@ApiTags('Super Admin - Tenants')
@ApiBearerAuth()
@UseGuards(SuperAdminGuard)
@Controller('super-admin/tenants')
export class SuperAdminController {
  constructor(private readonly storage: StorageService) {}

  private hash(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  @Get()
  @ApiOperation({ summary: 'Get all tenants', description: 'Retrieve list of all tenants (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'List of tenants retrieved successfully' })
  list(): TenantRecord[] {
    return this.storage.readTenants();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID', description: 'Retrieve a single tenant by ID (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  get(@Param('id') id: string): TenantRecord | undefined {
    return this.storage.readTenants().find((t) => t.id === id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new tenant', description: 'Create a new tenant (Super Admin only)' })
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
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
  @ApiOperation({ summary: 'Update tenant', description: 'Update an existing tenant (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
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
  @ApiOperation({ summary: 'Delete tenant', description: 'Delete a tenant (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant deleted successfully' })
  remove(@Param('id') id: string) {
    const tenants = this.storage.readTenants();
    const filtered = tenants.filter((t) => t.id !== id);
    this.storage.writeTenants(filtered);
    return { deleted: tenants.length - filtered.length };
  }

  @Post(':id/admins')
  @ApiOperation({ summary: 'Create tenant admin', description: 'Create an admin for a tenant (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiBody({ type: CreateTenantAdminDto })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
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
