import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

type AdminUserRecord = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  department?: string;
  position?: string;
  isActive: boolean;
  permissions?: string[];
  createdAt: string;
  lastLoginAt?: string;
};

@UseGuards(TenantContextGuard)
@Controller('tenant/admin-users')
export class AdminUsersController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<AdminUserRecord>(tenantId, 'admin-users');
  }
  private write(tenantId: string, docs: AdminUserRecord[]) {
    return this.storage.writeCollection<AdminUserRecord>(tenantId, 'admin-users', docs);
  }

  @Get()
  list(@Req() req: any) {
    return this.read(req.tenantId);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.read(req.tenantId).find((d) => d.id === id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateAdminUserDto) {
    const now = new Date().toISOString();
    const doc: AdminUserRecord = {
      id: randomUUID(),
      ...dto,
      createdAt: now
    };
    const all = this.read(req.tenantId);
    all.push(doc);
    this.write(req.tenantId, all);
    return doc;
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    const all = this.read(req.tenantId);
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...dto };
    this.write(req.tenantId, all);
    return all[idx];
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const all = this.read(req.tenantId);
    const filtered = all.filter((d) => d.id !== id);
    this.write(req.tenantId, filtered);
    return { deleted: all.length - filtered.length };
  }
}
