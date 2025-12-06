import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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

@ApiTags('Departments')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Get all departments', description: 'Retrieve list of departments' })
  @ApiResponse({ status: 200, description: 'List of departments retrieved successfully' })
  list(@Req() req: any) {
    return this.read(req.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID', description: 'Retrieve a single department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Department retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  get(@Req() req: any, @Param('id') id: string) {
    return this.read(req.tenantId).find((d) => d.id === id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new department', description: 'Create a new department' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
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
  @ApiOperation({ summary: 'Update department', description: 'Update an existing department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    const all = this.read(req.tenantId);
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...dto, updatedAt: new Date().toISOString() };
    this.write(req.tenantId, all);
    return all[idx];
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department', description: 'Delete a department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  remove(@Req() req: any, @Param('id') id: string) {
    const all = this.read(req.tenantId);
    const filtered = all.filter((d) => d.id !== id);
    this.write(req.tenantId, filtered);
    return { deleted: all.length - filtered.length };
  }
}

