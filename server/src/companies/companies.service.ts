import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { Project } from '../projects/project.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(tenantId: string, dto: CreateCompanyDto) {
    await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);

    const company = this.companiesRepository.create({
      ...dto,
      tenantId,
    });

    return this.companiesRepository.save(company);
  }

  findAllForTenant(tenantId: string) {
    return this.companiesRepository.find({
      where: { tenantId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateCompanyDto) {
    const existing = await this.companiesRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Company not found');
    }

    if (dto.projectId) {
      await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
      existing.projectId = dto.projectId;
    }

    if (dto.companyName !== undefined) {
      existing.companyName = dto.companyName;
    }

    if (dto.description !== undefined) {
      existing.description = dto.description;
    }

    return this.companiesRepository.save(existing);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.companiesRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Company not found');
    }

    await this.companiesRepository.remove(existing);
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
