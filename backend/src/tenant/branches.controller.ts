import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, Query } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

type BranchRecord = {
  id: string;
  projectCode: string;
  title_en: string;
  title_ru: string;
  title_tr: string;
  createdAt: string;
  updatedAt: string;
};

@UseGuards(TenantContextGuard)
@Controller('tenant/branches')
export class BranchesController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<BranchRecord>(tenantId, 'branches');
  }

  private write(tenantId: string, docs: BranchRecord[]) {
    return this.storage.writeCollection<BranchRecord>(tenantId, 'branches', docs);
  }

  @Get()
  list(
    @Req() req: any,
    @Query('projectCode') projectCode?: string,
    @Query('search') search?: string,
  ) {
    let data = this.read(req.tenantId);

    // Apply filters
    if (projectCode) {
      data = data.filter((d) => d.projectCode === projectCode);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter((d) =>
        d.title_en?.toLowerCase().includes(searchLower) ||
        d.title_ru?.toLowerCase().includes(searchLower) ||
        d.title_tr?.toLowerCase().includes(searchLower) ||
        d.projectCode?.toLowerCase().includes(searchLower)
      );
    }

    return data;
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.read(req.tenantId).find((d) => d.id === id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateBranchDto) {
    const now = new Date().toISOString();
    const doc: BranchRecord = {
      id: randomUUID(),
      projectCode: dto.projectCode,
      title_en: dto.title_en,
      title_ru: dto.title_ru,
      title_tr: dto.title_tr,
      createdAt: now,
      updatedAt: now
    };
    const all = this.read(req.tenantId);
    all.push(doc);
    this.write(req.tenantId, all);
    return doc;
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateBranchDto) {
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
