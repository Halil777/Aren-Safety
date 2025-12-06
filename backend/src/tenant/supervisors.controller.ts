import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { randomUUID, createHash } from "crypto";
import { StorageService } from "../storage/storage.service";
import { TenantContextGuard } from "./tenant.guard";
import { CreateSupervisorDto } from "./dto/create-supervisor.dto";
import { UpdateSupervisorDto } from "./dto/update-supervisor.dto";
import { Supervisor } from "../shared/types";

@ApiTags('Supervisors')
@ApiBearerAuth()
@UseGuards(TenantContextGuard)
@Controller("tenant/supervisors")
export class SupervisorsController {
  constructor(private readonly storage: StorageService) {}

  private hash(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private read(tenantId: string) {
    return this.storage.readCollection<Supervisor>(tenantId, "supervisors");
  }
  private write(tenantId: string, docs: Supervisor[]) {
    return this.storage.writeCollection<Supervisor>(
      tenantId,
      "supervisors",
      docs
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all supervisors', description: 'Retrieve list of supervisors with optional filters' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of supervisors retrieved successfully' })
  list(
    @Req() req: any,
    @Query("projectId") projectId?: string,
    @Query("department") department?: string,
    @Query("search") search?: string
  ) {
    let data = this.read(req.tenantId);

    // Apply filters
    if (projectId) {
      data = data.filter((d) => d.projectIds.includes(projectId));
    }
    if (department) {
      data = data.filter((d) => d.department === department);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.firstName?.toLowerCase().includes(searchLower) ||
          d.lastName?.toLowerCase().includes(searchLower) ||
          d.email?.toLowerCase().includes(searchLower) ||
          d.login?.toLowerCase().includes(searchLower) ||
          d.position?.toLowerCase().includes(searchLower)
      );
    }

    // Remove password hash from response
    return data.map(({ passwordHash, ...supervisor }) => supervisor);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get supervisor by ID', description: 'Retrieve a single supervisor by ID' })
  @ApiParam({ name: 'id', description: 'Supervisor ID' })
  @ApiResponse({ status: 200, description: 'Supervisor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Supervisor not found' })
  get(@Req() req: any, @Param("id") id: string) {
    const supervisor = this.read(req.tenantId).find((d) => d.id === id);
    if (!supervisor) return undefined;
    const { passwordHash, ...supervisorWithoutPassword } = supervisor;
    return supervisorWithoutPassword;
  }

  @Post()
  @ApiOperation({ summary: 'Create new supervisor', description: 'Create a new supervisor' })
  @ApiBody({ type: CreateSupervisorDto })
  @ApiResponse({ status: 201, description: 'Supervisor created successfully' })
  create(@Req() req: any, @Body() dto: CreateSupervisorDto) {
    const now = new Date().toISOString();
    const passwordHash = this.hash(dto.password);

    const doc: Supervisor = {
      id: randomUUID(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      login: dto.login,
      passwordHash,
      email: dto.email,
      position: dto.position,
      projectIds: dto.projectIds,
      phone: dto.phone,
      department: dto.department,
      createdAt: now,
      updatedAt: now,
    };

    const all = this.read(req.tenantId);
    all.push(doc);
    this.write(req.tenantId, all);

    const { passwordHash: _, ...supervisorWithoutPassword } = doc;
    return supervisorWithoutPassword;
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update supervisor', description: 'Update an existing supervisor' })
  @ApiParam({ name: 'id', description: 'Supervisor ID' })
  @ApiBody({ type: UpdateSupervisorDto })
  @ApiResponse({ status: 200, description: 'Supervisor updated successfully' })
  @ApiResponse({ status: 404, description: 'Supervisor not found' })
  update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateSupervisorDto
  ) {
    const all = this.read(req.tenantId);
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;

    const updateData: any = { ...dto, updatedAt: new Date().toISOString() };

    // Hash password if it's being updated
    if (dto.password) {
      updateData.passwordHash = this.hash(dto.password);
      delete updateData.password;
    }

    all[idx] = { ...all[idx], ...updateData };
    this.write(req.tenantId, all);

    const { passwordHash, ...supervisorWithoutPassword } = all[idx];
    return supervisorWithoutPassword;
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete supervisor', description: 'Delete a supervisor' })
  @ApiParam({ name: 'id', description: 'Supervisor ID' })
  @ApiResponse({ status: 200, description: 'Supervisor deleted successfully' })
  remove(@Req() req: any, @Param("id") id: string) {
    const all = this.read(req.tenantId);
    const filtered = all.filter((d) => d.id !== id);
    this.write(req.tenantId, filtered);
    return { deleted: all.length - filtered.length };
  }
}
