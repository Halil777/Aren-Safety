import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './branch.entity';
import { Project } from '../projects/project.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(tenantId: string, dto: CreateBranchDto) {
    await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);

    const branch = this.branchesRepository.create({
      ...dto,
      tenantId,
    });

    return this.branchesRepository.save(branch);
  }

  findAllForTenant(tenantId: string) {
    return this.branchesRepository.find({
      where: { tenantId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateBranchDto) {
    const existing = await this.branchesRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Branch not found');
    }

    if (dto.projectId) {
      await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
      existing.projectId = dto.projectId;
    }

    if (dto.name !== undefined) {
      existing.name = dto.name;
    }

    if (dto.description !== undefined) {
      existing.description = dto.description;
    }

    return this.branchesRepository.save(existing);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.branchesRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Branch not found');
    }

    await this.branchesRepository.remove(existing);
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
