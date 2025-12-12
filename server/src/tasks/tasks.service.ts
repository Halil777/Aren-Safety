import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CategoryType } from '../categories/category-type';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(tenantId: string, dto: CreateTaskDto) {
    await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
    await this.ensureDepartmentForTenant(dto.departmentId, tenantId, dto.projectId);
    const category = await this.ensureTaskCategory(dto.categoryId, tenantId, dto.projectId);

    const deadline = this.parseDeadline(dto.deadline);

    const task = this.tasksRepository.create({
      ...dto,
      categoryId: category.id,
      deadline,
      tenantId,
    });

    return this.tasksRepository.save(task);
  }

  findAllForTenant(tenantId: string) {
    return this.tasksRepository.find({
      where: { tenantId },
      relations: ['project', 'department', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateTaskDto) {
    const task = await this.tasksRepository.findOne({
      where: { id, tenantId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const projectId = dto.projectId ?? task.projectId;
    await this.ensureProjectBelongsToTenant(projectId, tenantId);

    const departmentId = dto.departmentId ?? task.departmentId;
    await this.ensureDepartmentForTenant(departmentId, tenantId, projectId);

    const categoryId = dto.categoryId ?? task.categoryId;
    const category = await this.ensureTaskCategory(categoryId, tenantId, projectId);

    task.projectId = projectId;
    task.departmentId = departmentId;
    task.categoryId = categoryId;

    if (dto.taskName !== undefined) {
      task.taskName = dto.taskName;
    }

    if (dto.description !== undefined) {
      task.description = dto.description;
    }

    if (dto.deadline !== undefined) {
      task.deadline = this.parseDeadline(dto.deadline);
    }

    return this.tasksRepository.save(task);
  }

  async remove(tenantId: string, id: string) {
    const task = await this.tasksRepository.findOne({
      where: { id, tenantId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.remove(task);
    return { success: true };
  }

  private async ensureProjectBelongsToTenant(projectId: string, tenantId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException('Project not found for tenant');
    }

    return project;
  }

  private async ensureDepartmentForTenant(
    departmentId: string,
    tenantId: string,
    projectId: string,
  ) {
    const department = await this.departmentsRepository.findOne({
      where: { id: departmentId, tenantId },
    });

    if (!department || department.projectId !== projectId) {
      throw new NotFoundException('Department not found for project');
    }

    return department;
  }

  private async ensureTaskCategory(
    categoryId: string,
    tenantId: string,
    projectId: string,
  ) {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId, tenantId, type: CategoryType.TASK },
    });

    if (!category || category.projectId !== projectId) {
      throw new NotFoundException('Task category not found for project');
    }

    return category;
  }

  private parseDeadline(deadline: string) {
    const parsed = new Date(deadline);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid deadline');
    }
    return parsed;
  }
}
