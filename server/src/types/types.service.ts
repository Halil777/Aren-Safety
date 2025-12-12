import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeEntity } from './type.entity';
import { Project } from '../projects/project.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(TypeEntity)
    private readonly typesRepository: Repository<TypeEntity>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(tenantId: string, dto: CreateTypeDto) {
    await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);

    const type = this.typesRepository.create({
      ...dto,
      tenantId,
    });

    return this.typesRepository.save(type);
  }

  findAllForTenant(tenantId: string) {
    return this.typesRepository.find({
      where: { tenantId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateTypeDto) {
    const existing = await this.typesRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Type not found');
    }

    if (dto.projectId) {
      await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
      existing.projectId = dto.projectId;
    }

    if (dto.typeName !== undefined) {
      existing.typeName = dto.typeName;
    }

    if (dto.description !== undefined) {
      existing.description = dto.description;
    }

    return this.typesRepository.save(existing);
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.typesRepository.findOne({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Type not found');
    }

    await this.typesRepository.remove(existing);
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
