import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { Project } from '../projects/project.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(tenantId: string, dto: CreateDepartmentDto) {
    await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
    const department = this.departmentsRepository.create({
      ...dto,
      tenantId,
    });
    return this.departmentsRepository.save(department);
  }

  findAllForTenant(tenantId: string) {
    return this.departmentsRepository.find({
      where: { tenantId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateDepartmentDto) {
    const existing = await this.departmentsRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    if (dto.projectId) {
      await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
      existing.projectId = dto.projectId;
    }

    if (dto.name !== undefined) {
      existing.name = dto.name;
    }

    return this.departmentsRepository.save(existing);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.departmentsRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    await this.departmentsRepository.remove(existing);
    return { success: true };
  }

  private async ensureProjectBelongsToTenant(projectId: string, tenantId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException('Project not found for tenant');
    }
  }
}
