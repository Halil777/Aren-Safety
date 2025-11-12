import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, Query } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

type TrainingRecord = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  instructor: string;
  department?: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number;
  capacity: number;
  enrolled: number;
  attendees: any[];
  materials: string[];
  certificate: boolean;
  mandatory: boolean;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
};

@UseGuards(TenantContextGuard)
@Controller('tenant/training')
export class TrainingController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<TrainingRecord>(tenantId, 'training');
  }
  private write(tenantId: string, docs: TrainingRecord[]) {
    return this.storage.writeCollection<TrainingRecord>(tenantId, 'training', docs);
  }

  @Get()
  list(
    @Req() req: any,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('department') department?: string,
    @Query('mandatory') mandatory?: string,
  ) {
    let data = this.read(req.tenantId);

    // Apply filters
    if (type) {
      data = data.filter((d) => d.type === type);
    }
    if (status) {
      data = data.filter((d) => d.status === status);
    }
    if (department) {
      data = data.filter((d) => d.department === department);
    }
    if (mandatory !== undefined) {
      const isMandatory = mandatory === 'true';
      data = data.filter((d) => d.mandatory === isMandatory);
    }

    return data;
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.read(req.tenantId).find((d) => d.id === id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTrainingDto) {
    const now = new Date().toISOString();
    const doc: TrainingRecord = {
      id: randomUUID(),
      ...dto,
      createdAt: now,
      updatedAt: now
    };
    const all = this.read(req.tenantId);
    all.push(doc);
    this.write(req.tenantId, all);
    return doc;
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTrainingDto) {
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
