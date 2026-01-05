import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskAttachment } from './taskAttachment.entity';
import { TaskStatus } from './task-status';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskMediaDto } from './dto/create-task-media.dto';
import { AnswerTaskDto } from './dto/answer-task.dto';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
import { CategoryType } from '../categories/category-type';
import { Company } from '../companies/company.entity';
import { MobileRole } from '../mobile-accounts/mobile-role';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(TaskAttachment)
    private readonly mediaRepository: Repository<TaskAttachment>,
    @InjectRepository(MobileAccount)
    private readonly accountsRepository: Repository<MobileAccount>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(tenantId: string, creatorId: string, dto: CreateTaskDto) {
    const creatorAccountId = dto.createdByUserId ?? creatorId;
    const creator = await this.ensureAccount(creatorAccountId, tenantId, MobileRole.SUPERVISOR);
    const supervisor = await this.ensureAccount(dto.supervisorId, tenantId, MobileRole.SUPERVISOR);
    if (creator.id === supervisor.id) {
      throw new BadRequestException('Task must be assigned to another supervisor');
    }

    const company = supervisor.companyId
      ? await this.findCompany(supervisor.companyId, tenantId)
      : null;
    const project = await this.findProject(dto.projectId, tenantId);
    const department = await this.findDepartment(dto.departmentId, tenantId);
    const category = await this.findCategory(dto.categoryId, tenantId);

    const deadline = this.parseDate(dto.deadline, 'deadline');

    const task = this.tasksRepository.create({
      ...dto,
      deadline,
      status: dto.status ?? TaskStatus.NEW,
      tenantId,
      createdByUserId: creator.id,
      supervisorId: supervisor.id,
      projectId: project.id,
      departmentId: department.id,
      categoryId: category.id,
      companyId: company?.id ?? null,
    });

    const saved = await this.tasksRepository.save(task);

    if (dto.media?.length) {
      const mediaEntities = dto.media.map(m =>
        this.mediaRepository.create({
          taskId: saved.id,
          uploadedByUserId: creator.id,
          url: m.url,
          type: m.type,
          isCorrective: m.isCorrective ?? false,
        }),
      );
      await this.mediaRepository.insert(mediaEntities);
    }

    return saved;
  }

  findAllForTenant(tenantId: string, role?: MobileRole | null, accountId?: string | null) {
    const where =
      role === MobileRole.SUPERVISOR && accountId
        ? [
            { tenantId, supervisorId: accountId },
            { tenantId, createdByUserId: accountId },
          ]
        : { tenantId };

    return this.tasksRepository.find({
      where,
      relations: [
        'project',
        'department',
        'category',
        'company',
        'createdBy',
        'supervisor',
        'supervisor.company',
      ],
      order: { createdAt: 'DESC' },
    });
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

  async findForMobile(accountId: string, role: MobileRole) {
    const where =
      role === MobileRole.SUPERVISOR
        ? [{ supervisorId: accountId }, { createdByUserId: accountId }]
        : [{ createdByUserId: accountId }];
    const data = await this.tasksRepository.find({
      where,
      relations: [
        'project',
        'department',
        'category',
        'company',
        'supervisor',
        'createdBy',
        'media',
      ],
      order: { createdAt: 'DESC' },
    });
    return data.map(t => this.mapForMobile(t));
  }

  async findOneForMobile(accountId: string, role: MobileRole, id: string) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: [
        'project',
        'department',
        'category',
        'company',
        'supervisor',
        'createdBy',
        'media',
      ],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const isCreator = task.createdByUserId === accountId;
    const isAssignedSupervisor = task.supervisorId === accountId;

    if (role === MobileRole.SUPERVISOR ? !(isCreator || isAssignedSupervisor) : !isCreator) {
      throw new BadRequestException('Not allowed to view this task');
    }

    if (
      role === MobileRole.SUPERVISOR &&
      isAssignedSupervisor &&
      task.status === TaskStatus.NEW
    ) {
      const seenAt = new Date();
      await this.tasksRepository.update(
        { id: task.id },
        { status: TaskStatus.SEEN_BY_SUPERVISOR, supervisorSeenAt: seenAt },
      );
      task.status = TaskStatus.SEEN_BY_SUPERVISOR;
      task.supervisorSeenAt = seenAt;
    }

    return this.mapForMobile(task);
  }

  async updateStatus(
    tenantId: string,
    accountId: string | null,
    role: MobileRole | null,
    id: string,
    dto: UpdateTaskDto,
  ) {
    const task = await this.tasksRepository.findOne({
      where: { id, tenantId },
      relations: role ? ['media'] : undefined,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (role) {
      const isCreator = task.createdByUserId === accountId;
      const isAssignedSupervisor = task.supervisorId === accountId;

      if (role === MobileRole.SUPERVISOR && !(isCreator || isAssignedSupervisor)) {
        throw new BadRequestException('Not allowed to update task');
      }

      if (role !== MobileRole.SUPERVISOR && !isCreator) {
        throw new BadRequestException('Not allowed to update task');
      }
    }

    if (dto.status !== undefined) {
      task.status = dto.status;
    }
    if (dto.rejectionReason !== undefined) {
      task.rejectionReason = dto.rejectionReason || null;
    }
    if (dto.supervisorSeenAt !== undefined) {
      task.supervisorSeenAt = dto.supervisorSeenAt
        ? this.parseDate(dto.supervisorSeenAt, 'supervisorSeenAt')
        : null;
    }
    if (dto.fixedAt !== undefined) {
      task.fixedAt = dto.fixedAt ? this.parseDate(dto.fixedAt, 'fixedAt') : null;
    }
    if (dto.closedAt !== undefined) {
      task.closedAt = dto.closedAt ? this.parseDate(dto.closedAt, 'closedAt') : null;
    }
    if (dto.description !== undefined) {
      task.description = dto.description;
    }

    if (dto.status && dto.status !== TaskStatus.REJECTED) {
      task.rejectionReason = null;
    }

    await this.tasksRepository.save(task);

    if (role && accountId && dto.media?.length) {
      const mediaEntities = dto.media.map(m =>
        this.mediaRepository.create({
          taskId: task.id,
          uploadedByUserId: accountId,
          url: m.url,
          type: m.type,
          isCorrective: m.isCorrective ?? true,
        }),
      );
      await this.mediaRepository.insert(mediaEntities);
    }

    if (role) {
      const withRelations = await this.tasksRepository.findOne({
        where: { id: task.id },
        relations: [
          'project',
          'department',
          'category',
          'company',
          'supervisor',
          'createdBy',
          'media',
        ],
      });
      return this.mapForMobile(withRelations!);
    }

    return task;
  }

  async addMedia(tenantId: string, taskId: string, dto: CreateTaskMediaDto) {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId, tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const uploader = await this.accountsRepository.findOne({
      where: { id: dto.uploadedByUserId },
    });
    if (!uploader) {
      throw new NotFoundException('Uploader not found');
    }

    const media = this.mediaRepository.create({
      ...dto,
      taskId,
    });
    return this.mediaRepository.save(media);
  }

  async answerTask(
    tenantId: string,
    accountId: string,
    role: MobileRole,
    id: string,
    dto: AnswerTaskDto,
  ) {
    if (role !== MobileRole.SUPERVISOR) {
      throw new ForbiddenException('Only supervisors can answer');
    }
    const task = await this.tasksRepository.findOne({
      where: { id, tenantId },
      relations: ['media'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.supervisorId !== accountId) {
      throw new ForbiddenException('Not allowed to answer this task');
    }

    const now = new Date();

    if (dto.answer !== undefined) {
      task.supervisorAnswer = dto.answer;
      task.answeredAt = now;
    }

    task.supervisorSeenAt ??= now;
    if (task.status !== TaskStatus.CLOSED) {
      task.status = TaskStatus.FIXED_PENDING_CHECK;
      task.fixedAt = task.fixedAt ?? now;
      task.rejectionReason = null;
    }

    await this.tasksRepository.save(task);

    if (dto.media?.length) {
      const mediaEntities = dto.media.map(m =>
        this.mediaRepository.create({
          taskId: task.id,
          uploadedByUserId: accountId,
          url: m.url,
          type: m.type,
          isCorrective: m.isCorrective ?? true,
        }),
      );
      await this.mediaRepository.insert(mediaEntities);
    }

    const withRelations = await this.tasksRepository.findOne({
      where: { id: task.id },
      relations: [
        'project',
        'department',
        'category',
        'company',
        'supervisor',
        'createdBy',
        'media',
      ],
    });
    return this.mapForMobile(withRelations!);
  }

  private async ensureAccount(id: string, tenantId: string, role: MobileRole) {
    const account = await this.accountsRepository.findOne({
      where: { id, tenantId, role, isActive: true },
    });
    if (!account) {
      throw new NotFoundException('Account not found for tenant');
    }
    return account;
  }

  private async findProject(projectId: string, tenantId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, tenantId },
    });
    if (!project) {
      throw new NotFoundException('Project not found for tenant');
    }
    return project;
  }

  private async findDepartment(departmentId: string, tenantId: string) {
    const department = await this.departmentsRepository.findOne({
      where: { id: departmentId, tenantId },
    });
    if (!department) {
      throw new NotFoundException('Department not found for tenant');
    }
    return department;
  }

  private async findCategory(categoryId: string, tenantId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId, tenantId, type: CategoryType.TASK },
    });
    if (!category) {
      throw new NotFoundException('Task category not found');
    }
    return category;
  }

  private parseDate(value: string, field: string) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`Invalid ${field}`);
    }
    return parsed;
  }

  private async findCompany(id: string, tenantId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id, tenantId },
    });
    if (!company) {
      throw new NotFoundException('Company not found for tenant');
    }
    return company;
  }

  private mapForMobile(task: Task) {
    return {
      id: task.id,
      description: task.description,
      deadline: task.deadline,
      createdAt: task.createdAt,
      status: task.status,
      projectId: task.projectId,
      departmentId: task.departmentId,
      categoryId: task.categoryId,
      supervisorId: task.supervisorId,
      createdByUserId: task.createdByUserId,
      companyId: task.companyId,
      projectName: task.project?.name,
      departmentName: task.department?.name,
      categoryName: (task.category as any)?.categoryName,
      companyName: task.company ? (task.company as any).companyName : null,
      supervisorName: task.supervisor?.fullName,
      createdByName: task.createdBy?.fullName,
      supervisorAnswer: task.supervisorAnswer,
      rejectionReason: task.rejectionReason,
      answeredAt: task.answeredAt,
      media:
        task.media?.map(m => ({
          id: m.id,
          type: m.type,
          url: m.url,
          isCorrective: m.isCorrective,
          uploadedByUserId: m.uploadedByUserId,
        })) ?? [],
    };
  }
}
