import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryType } from './category-type';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Project } from '../projects/project.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(
    tenantId: string,
    type: CategoryType,
    dto: CreateCategoryDto,
  ) {
    await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);

    const category = this.categoriesRepository.create({
      ...dto,
      type,
      tenantId,
    });
    return this.categoriesRepository.save(category);
  }

  findAllForTenant(tenantId: string, type: CategoryType) {
    return this.categoriesRepository.find({
      where: { tenantId, type },
      relations: ['project', 'subcategories'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    tenantId: string,
    id: string,
    type: CategoryType,
    dto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesRepository.findOne({
      where: { id, tenantId, type },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.projectId) {
      await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
      category.projectId = dto.projectId;
    }

    if (dto.categoryName !== undefined) {
      category.categoryName = dto.categoryName;
    }

    return this.categoriesRepository.save(category);
  }

  async remove(tenantId: string, id: string, type: CategoryType) {
    const category = await this.categoriesRepository.findOne({
      where: { id, tenantId, type },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.remove(category);
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
