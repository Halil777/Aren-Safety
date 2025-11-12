import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

type DepartmentRecord = {
  id: string;
  title_en: string;
  title_ru: string;
  title_tr: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

@UseGuards(TenantContextGuard)
@Controller('tenant/departments')
export class DepartmentsController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<DepartmentRecord>(tenantId, 'departments');
  }
  private write(tenantId: string, docs: DepartmentRecord[]) {
    return this.storage.writeCollection<DepartmentRecord>(tenantId, 'departments', docs);
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
  create(@Req() req: any, @Body() dto: CreateDepartmentDto) {
    const now = new Date().toISOString();
    const doc: DepartmentRecord = {
      id: randomUUID(),
      ...dto,
      status: dto.status ?? true,
      createdAt: now,
      updatedAt: now
    };
    const all = this.read(req.tenantId);
    all.push(doc);
    this.write(req.tenantId, all);
    return doc;
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    const all = this.read(req.tenantId);
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...dto, updatedAt: new Date().toISOString() };
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

