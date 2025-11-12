import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, Query } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';

type ObservationRecord = {
  key: string;
  id: string;
  projectCode: string;
  nameSurname: string;
  department: string;
  nonconformityType: string;
  observationDate: string;
  riskLevel: number;
  status: string;
  deadline: string;
  task?: string;
  upperCategory?: string;
  lowerCategory?: string;
  description_en?: string;
  description_ru?: string;
  description_tr?: string;
  createdAt: string;
  updatedAt: string;
};

@UseGuards(TenantContextGuard)
@Controller('tenant/observations')
export class ObservationsController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<ObservationRecord>(tenantId, 'observations');
  }
  private write(tenantId: string, docs: ObservationRecord[]) {
    return this.storage.writeCollection<ObservationRecord>(tenantId, 'observations', docs);
  }

  @Get()
  list(
    @Req() req: any,
    @Query('projectCode') projectCode?: string,
    @Query('department') department?: string,
    @Query('nonconformityType') nonconformityType?: string,
    @Query('task') task?: string,
    @Query('upperCategory') upperCategory?: string,
    @Query('lowerCategory') lowerCategory?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    let data = this.read(req.tenantId);

    // Apply filters
    if (projectCode) {
      data = data.filter((d) => d.projectCode === projectCode);
    }
    if (department) {
      data = data.filter((d) => d.department === department);
    }
    if (nonconformityType) {
      data = data.filter((d) => d.nonconformityType === nonconformityType);
    }
    if (task) {
      data = data.filter((d) => d.task === task);
    }
    if (upperCategory) {
      data = data.filter((d) => d.upperCategory === upperCategory);
    }
    if (lowerCategory) {
      data = data.filter((d) => d.lowerCategory === lowerCategory);
    }
    if (startDate) {
      data = data.filter((d) => new Date(d.observationDate) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter((d) => new Date(d.observationDate) <= new Date(endDate));
    }

    return data;
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.read(req.tenantId).find((d) => d.id === id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateObservationDto) {
    const now = new Date().toISOString();
    const id = (dto.id && (dto.id as string).trim().length > 0) ? dto.id : randomUUID();
    const doc: ObservationRecord = {
      key: id,
      id: id,
      projectCode: dto.projectCode,
      nameSurname: dto.nameSurname,
      department: dto.department,
      nonconformityType: dto.nonconformityType,
      observationDate: dto.observationDate,
      riskLevel: dto.riskLevel,
      status: dto.status,
      deadline: dto.deadline,
      task: dto.task,
      upperCategory: dto.upperCategory,
      lowerCategory: dto.lowerCategory,
      description_en: dto.description_en,
      description_ru: dto.description_ru,
      description_tr: dto.description_tr,
      createdAt: now,
      updatedAt: now
    };
    const all = this.read(req.tenantId);
    all.push(doc);
    this.write(req.tenantId, all);
    return doc;
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateObservationDto) {
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


