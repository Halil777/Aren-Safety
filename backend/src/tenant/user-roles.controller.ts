import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';

type UserRoleRecord = {
  id: string;
  name_en: string;
  name_ru: string;
  name_tr: string;
  createdAt: string;
  updatedAt: string;
};

@UseGuards(AuthGuard, TenantContextGuard, RolesGuard)
@Controller('tenant/user-roles')
export class UserRolesController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<UserRoleRecord>(tenantId, 'user-roles');
  }

  private write(tenantId: string, docs: UserRoleRecord[]) {
    return this.storage.writeCollection<UserRoleRecord>(tenantId, 'user-roles', docs);
  }

  @Get()
  list(@Req() req: any) {
    return this.read(req.tenantId);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    const userRole = this.read(req.tenantId).find((d) => d.id === id);
    if (!userRole) {
      throw new NotFoundException('User role not found');
    }
    return userRole;
  }

  @Post()
  @Roles('admin', 'manager')
  create(@Req() req: any, @Body() dto: CreateUserRoleDto) {
    const now = new Date().toISOString();
    const all = this.read(req.tenantId);

    const doc: UserRoleRecord = {
      id: randomUUID(),
      name_en: dto.name_en,
      name_ru: dto.name_ru,
      name_tr: dto.name_tr,
      createdAt: now,
      updatedAt: now
    };

    all.push(doc);
    this.write(req.tenantId, all);
    return doc;
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    const all = this.read(req.tenantId);
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException('User role not found');

    const updates: Partial<UserRoleRecord> = {};
    if (dto.name_en !== undefined) updates.name_en = dto.name_en;
    if (dto.name_ru !== undefined) updates.name_ru = dto.name_ru;
    if (dto.name_tr !== undefined) updates.name_tr = dto.name_tr;

    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    this.write(req.tenantId, all);
    return all[idx];
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Req() req: any, @Param('id') id: string) {
    const all = this.read(req.tenantId);
    const userRole = all.find((d) => d.id === id);
    if (!userRole) {
      throw new NotFoundException('User role not found');
    }

    const filtered = all.filter((d) => d.id !== id);
    this.write(req.tenantId, filtered);
    return { deleted: all.length - filtered.length, message: 'User role deleted successfully' };
  }
}
