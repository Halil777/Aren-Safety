import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, Query } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

type EmployeeRecord = {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'on_leave' | 'suspended' | 'terminated';
  avatar?: string;

  // Safety-specific fields
  safetyRole?: 'worker' | 'safety_team' | 'inspector' | 'head_of_safety';
  lastTrainingDate?: string;
  trainingExpiryDate?: string;
  certifications: string[];
  incidentCount: number;
  observationsSubmitted: number;

  // Contact & Emergency
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Location
  workLocation: string;
  shift?: 'day' | 'night' | 'rotating';

  // Inspector-specific (deprecated - use safetyRole: 'inspector')
  licenseId?: string;
  region?: string;
  assignedSites?: number;
  lastAuditDate?: string;

  // Safety staff-specific (deprecated - use safetyRole: 'safety_team')
  expertise?: string;
  certificationLevel?: string;
  yearsOfExperience?: number;

  createdAt: string;
  updatedAt: string;
};

@UseGuards(TenantContextGuard)
@Controller('tenant/employees')
export class EmployeesController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<EmployeeRecord>(tenantId, 'employees');
  }
  private write(tenantId: string, docs: EmployeeRecord[]) {
    return this.storage.writeCollection<EmployeeRecord>(tenantId, 'employees', docs);
  }

  @Get()
  list(
    @Req() req: any,
    @Query('safetyRole') safetyRole?: string,
    @Query('department') department?: string,
    @Query('status') status?: string,
    @Query('workLocation') workLocation?: string,
    @Query('search') search?: string,
  ) {
    let data = this.read(req.tenantId);

    // Apply filters
    if (safetyRole) {
      data = data.filter((d) => d.safetyRole === safetyRole);
    }
    if (department) {
      data = data.filter((d) => d.department === department);
    }
    if (status) {
      data = data.filter((d) => d.status === status);
    }
    if (workLocation) {
      data = data.filter((d) => d.workLocation === workLocation);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter((d) =>
        d.firstName?.toLowerCase().includes(searchLower) ||
        d.lastName?.toLowerCase().includes(searchLower) ||
        d.email?.toLowerCase().includes(searchLower) ||
        d.employeeNumber?.toLowerCase().includes(searchLower) ||
        d.position?.toLowerCase().includes(searchLower)
      );
    }

    return data;
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.read(req.tenantId).find((d) => d.id === id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateEmployeeDto) {
    const now = new Date().toISOString();
    const doc: EmployeeRecord = {
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
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
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
