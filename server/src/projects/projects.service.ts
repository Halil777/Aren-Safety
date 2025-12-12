import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(tenantId: string, dto: CreateProjectDto) {
    const project = this.projectRepository.create({
      ...dto,
      tenantId,
    });
    return this.projectRepository.save(project);
  }

  findAllForTenant(tenantId: string) {
    return this.projectRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateProjectDto) {
    const existing = await this.projectRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    Object.assign(existing, dto);
    return this.projectRepository.save(existing);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.projectRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.remove(existing);
    return { success: true };
  }
}
