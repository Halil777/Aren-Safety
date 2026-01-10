import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observation } from './observation.entity';
import { ObservationMedia } from './observationMedia.entity';
import { ObservationStatus } from './observation-status';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { CreateObservationMediaDto } from './dto/create-observation-media.dto';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Project } from '../projects/project.entity';
import { Location } from '../locations/location.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { MobileRole } from '../mobile-accounts/mobile-role';
import { CategoryType } from '../categories/category-type';
import { Company } from '../companies/company.entity';
import { AnswerObservationDto } from './dto/answer-observation.dto';
import { Branch } from '../branches/branch.entity';

@Injectable()
export class ObservationsService {
  constructor(
    @InjectRepository(Observation)
    private readonly observationsRepository: Repository<Observation>,
    @InjectRepository(ObservationMedia)
    private readonly mediaRepository: Repository<ObservationMedia>,
    @InjectRepository(MobileAccount)
    private readonly accountsRepository: Repository<MobileAccount>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoriesRepository: Repository<Subcategory>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
  ) {}

  async create(tenantId: string, creatorId: string, dto: CreateObservationDto) {
    const creatorAccountId = dto.createdByUserId ?? creatorId;
    const creator = await this.ensureAccount(creatorAccountId, tenantId, MobileRole.SUPERVISOR);
    const supervisor = await this.ensureAccount(dto.supervisorId, tenantId, MobileRole.SUPERVISOR);
    if (creator.id === supervisor.id) {
      throw new BadRequestException('Observation must be assigned to another supervisor');
    }
    const company = supervisor.companyId
      ? await this.findCompany(supervisor.companyId, tenantId)
      : null;
    const project = await this.findProject(dto.projectId, tenantId);
    const location = dto.locationId
      ? await this.findLocation(dto.locationId, tenantId, project.id)
      : null;
    const department = await this.findDepartment(dto.departmentId, tenantId);
    const category = await this.findCategory(dto.categoryId, tenantId);
    const subcategory = dto.subcategoryId
      ? await this.findSubcategory(dto.subcategoryId, tenantId, category.id)
      : null;
    const branch = dto.branchId ? await this.findBranch(dto.branchId, tenantId, project.id) : null;

    const deadline = this.parseDate(dto.deadline, 'deadline');

    const observation = this.observationsRepository.create({
      ...dto,
      deadline,
      status: dto.status ?? ObservationStatus.NEW,
      tenantId,
      createdByUserId: creator.id,
      supervisorId: supervisor.id,
      projectId: project.id,
      locationId: location?.id ?? null,
      departmentId: department.id,
      categoryId: category.id,
      subcategoryId: subcategory?.id ?? null,
      companyId: company?.id ?? null,
      branchId: branch?.id ?? null,
    });

    const saved = await this.observationsRepository.save(observation);

    if (dto.media?.length) {
      const mediaEntities = dto.media.map(m =>
        this.mediaRepository.create({
          observationId: saved.id,
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

    return this.observationsRepository.find({
      where,
      relations: [
        'project',
        'location',
        'department',
        'category',
        'subcategory',
        'branch',
        'company',
        'createdBy',
        'supervisor',
        'supervisor.company',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findForMobile(accountId: string, role: MobileRole) {
    const where =
      role === MobileRole.SUPERVISOR
        ? [{ supervisorId: accountId }, { createdByUserId: accountId }]
        : [{ createdByUserId: accountId }];
    const data = await this.observationsRepository.find({
      where,
      relations: [
        'project',
        'location',
        'department',
        'category',
        'subcategory',
        'branch',
        'company',
        'supervisor',
        'createdBy',
        'media',
      ],
      order: { createdAt: 'DESC' },
    });
    return data.map(o => this.mapForMobile(o));
  }

  async findOneForMobile(accountId: string, role: MobileRole, id: string) {
    const observation = await this.observationsRepository.findOne({
      where: { id },
      relations: [
        'project',
        'location',
        'department',
        'category',
        'subcategory',
        'branch',
        'company',
        'supervisor',
        'createdBy',
        'media',
      ],
    });
    if (!observation) {
      throw new NotFoundException('Observation not found');
    }

    const isCreator = observation.createdByUserId === accountId;
    const isAssignedSupervisor = observation.supervisorId === accountId;

    if (role === MobileRole.SUPERVISOR ? !(isCreator || isAssignedSupervisor) : !isCreator) {
      throw new BadRequestException('Not allowed to view this observation');
    }

    // Mark as seen when supervisor opens the observation so status moves off NEW automatically
    if (
      role === MobileRole.SUPERVISOR &&
      isAssignedSupervisor &&
      observation.status === ObservationStatus.NEW
    ) {
      const seenAt = new Date();
      await this.observationsRepository.update(
        { id: observation.id },
        { status: ObservationStatus.SEEN_BY_SUPERVISOR, supervisorSeenAt: seenAt },
      );
      observation.status = ObservationStatus.SEEN_BY_SUPERVISOR;
      observation.supervisorSeenAt = seenAt;
    }

    return this.mapForMobile(observation);
  }

  async updateStatus(
    tenantId: string,
    accountId: string | null,
    role: MobileRole | null,
    id: string,
    dto: UpdateObservationDto,
  ) {
    const observation = await this.observationsRepository.findOne({
      where: { id, tenantId },
    });

    if (!observation) {
      throw new NotFoundException('Observation not found');
    }

    if (role) {
      const isCreator = observation.createdByUserId === accountId;
      const isAssignedSupervisor = observation.supervisorId === accountId;

      if (role === MobileRole.SUPERVISOR && !(isCreator || isAssignedSupervisor)) {
        throw new BadRequestException('Not allowed to update observation');
      }

      if (role !== MobileRole.SUPERVISOR && !isCreator) {
        throw new BadRequestException('Not allowed to update observation');
      }
    }

    if (dto.status !== undefined) {
      observation.status = dto.status;
    }
    if (dto.rejectionReason !== undefined) {
      observation.rejectionReason = dto.rejectionReason || null;
    }
    if (dto.supervisorSeenAt !== undefined) {
      observation.supervisorSeenAt = dto.supervisorSeenAt
        ? this.parseDate(dto.supervisorSeenAt, 'supervisorSeenAt')
        : null;
    }
    if (dto.fixedAt !== undefined) {
      observation.fixedAt = dto.fixedAt ? this.parseDate(dto.fixedAt, 'fixedAt') : null;
    }
    if (dto.closedAt !== undefined) {
      observation.closedAt = dto.closedAt ? this.parseDate(dto.closedAt, 'closedAt') : null;
    }
    if (dto.description !== undefined) {
      observation.description = dto.description;
    }

    if (dto.status && dto.status !== ObservationStatus.REJECTED) {
      observation.rejectionReason = null;
    }

    return this.observationsRepository.save(observation);
  }

  async addMedia(
    tenantId: string,
    observationId: string,
    dto: CreateObservationMediaDto,
  ) {
    const observation = await this.observationsRepository.findOne({
      where: { id: observationId, tenantId },
    });
    if (!observation) {
      throw new NotFoundException('Observation not found');
    }

    const uploader = await this.accountsRepository.findOne({
      where: { id: dto.uploadedByUserId },
    });
    if (!uploader) {
      throw new NotFoundException('Uploader not found');
    }

    const media = this.mediaRepository.create({
      ...dto,
      observationId,
    });
    return this.mediaRepository.save(media);
  }

  async answerObservation(
    tenantId: string,
    accountId: string,
    role: MobileRole,
    id: string,
    dto: AnswerObservationDto,
  ) {
    if (role !== MobileRole.SUPERVISOR) {
      throw new ForbiddenException('Only supervisors can answer');
    }
    const observation = await this.observationsRepository.findOne({
      where: { id, tenantId },
      relations: ['media'],
    });
    if (!observation) {
      throw new NotFoundException('Observation not found');
    }
    if (observation.supervisorId !== accountId) {
      throw new ForbiddenException('Not allowed to answer this observation');
    }

    const now = new Date();

    if (dto.answer !== undefined) {
      observation.supervisorAnswer = dto.answer;
      observation.answeredAt = now;
    }

    // Automatically move the status forward when supervisor answers
    observation.supervisorSeenAt ??= now;
    if (observation.status !== ObservationStatus.CLOSED) {
      observation.status = ObservationStatus.FIXED_PENDING_CHECK;
      observation.fixedAt = observation.fixedAt ?? now;
      observation.rejectionReason = null;
    }

    await this.observationsRepository.save(observation);

    if (dto.media?.length) {
      const mediaEntities = dto.media.map(m =>
        this.mediaRepository.create({
          observationId: observation.id,
          uploadedByUserId: accountId,
          url: m.url,
          type: m.type,
          isCorrective: m.isCorrective ?? true,
        }),
      );
      await this.mediaRepository.insert(mediaEntities);
    }

    const withRelations = await this.observationsRepository.findOne({
      where: { id: observation.id },
      relations: [
        'project',
        'location',
        'department',
        'category',
        'subcategory',
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

  private async findLocation(locationId: string, tenantId: string, projectId: string) {
    const location = await this.locationsRepository.findOne({
      where: { id: locationId, tenantId, projectId },
    });
    if (!location) {
      throw new NotFoundException('Location not found for project');
    }
    return location;
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
      where: { id: categoryId, tenantId, type: CategoryType.OBSERVATION },
    });
    if (!category) {
      throw new NotFoundException('Observation category not found');
    }
    return category;
  }

  private async findSubcategory(subcategoryId: string, tenantId: string, categoryId: string) {
    const subcategory = await this.subcategoriesRepository.findOne({
      where: { id: subcategoryId, tenantId, type: CategoryType.OBSERVATION },
    });
    if (!subcategory || subcategory.categoryId !== categoryId) {
      throw new NotFoundException('Observation subcategory not found');
    }
    return subcategory;
  }

  private async findBranch(branchId: string, tenantId: string, projectId: string) {
    const branch = await this.branchesRepository.findOne({
      where: { id: branchId, tenantId, projectId },
    });
    if (!branch) {
      throw new NotFoundException('Branch not found for project');
    }
    return branch;
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

  private mapForMobile(observation: Observation) {
    return {
      id: observation.id,
      workerFullName: observation.workerFullName,
      workerProfession: observation.workerProfession,
      riskLevel: observation.riskLevel,
      description: observation.description,
      deadline: observation.deadline,
      createdAt: observation.createdAt,
      status: observation.status,
      projectId: observation.projectId,
      locationId: observation.locationId,
      departmentId: observation.departmentId,
      categoryId: observation.categoryId,
      subcategoryId: observation.subcategoryId,
      branchId: observation.branchId,
      supervisorId: observation.supervisorId,
      createdByUserId: observation.createdByUserId,
      companyId: observation.companyId,
      projectName: observation.project?.name,
      locationName: observation.location?.name,
      departmentName: observation.department?.name,
      categoryName: (observation.category as any)?.categoryName,
      subcategoryName: (observation.subcategory as any)?.subcategoryName,
      branchName: observation.branch?.name,
      companyName: observation.company ? (observation.company as any).companyName : null,
      supervisorName: observation.supervisor?.fullName,
      createdByName: observation.createdBy?.fullName,
      supervisorAnswer: observation.supervisorAnswer,
      rejectionReason: observation.rejectionReason,
      answeredAt: observation.answeredAt,
      media:
        observation.media?.map(m => ({
          id: m.id,
          type: m.type,
          url: m.url,
          isCorrective: m.isCorrective,
          uploadedByUserId: m.uploadedByUserId,
        })) ?? [],
    };
  }
}
