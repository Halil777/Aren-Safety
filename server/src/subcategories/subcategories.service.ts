import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Category } from '../categories/category.entity';
import { CategoryType } from '../categories/category-type';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoriesRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(
    tenantId: string,
    type: CategoryType,
    dto: CreateSubcategoryDto,
  ) {
    const category = await this.findCategoryForTenant(dto.categoryId, tenantId, type);

    const subcategory = this.subcategoriesRepository.create({
      ...dto,
      projectId: category.projectId,
      tenantId,
      type,
    });
    return this.subcategoriesRepository.save(subcategory);
  }

  findAllForTenant(tenantId: string, type: CategoryType) {
    return this.subcategoriesRepository.find({
      where: { tenantId, type },
      relations: ['project', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    tenantId: string,
    id: string,
    type: CategoryType,
    dto: UpdateSubcategoryDto,
  ) {
    const subcategory = await this.subcategoriesRepository.findOne({
      where: { id, tenantId, type },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    if (dto.categoryId) {
      const category = await this.findCategoryForTenant(dto.categoryId, tenantId, type);
      subcategory.categoryId = category.id;
      subcategory.projectId = category.projectId;
    }

    if (dto.subcategoryName !== undefined) {
      subcategory.subcategoryName = dto.subcategoryName;
    }

    return this.subcategoriesRepository.save(subcategory);
  }

  async remove(tenantId: string, id: string, type: CategoryType) {
    const subcategory = await this.subcategoriesRepository.findOne({
      where: { id, tenantId, type },
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    await this.subcategoriesRepository.remove(subcategory);
    return { success: true };
  }

  private async findCategoryForTenant(id: string, tenantId: string, type: CategoryType) {
    const category = await this.categoriesRepository.findOne({
      where: { id, tenantId, type },
    });

    if (!category) {
      throw new NotFoundException('Category not found for tenant');
    }

    return category;
  }
}
