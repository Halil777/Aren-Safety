import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MobileAccount } from './mobile-account.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Company } from '../companies/company.entity';
import { CreateMobileAccountDto } from './dto/create-mobile-account.dto';
import { UpdateMobileAccountDto } from './dto/update-mobile-account.dto';
import { MobileRole } from './mobile-role';

@Injectable()
export class MobileAccountsService {
  constructor(
    @InjectRepository(MobileAccount)
    private readonly accountsRepository: Repository<MobileAccount>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(tenantId: string, dto: CreateMobileAccountDto) {
    await this.ensureLoginUnique(dto.login);

    const projects = await this.findProjects(dto.projectIds, tenantId);
    const department = dto.departmentId
      ? await this.findDepartment(dto.departmentId, tenantId)
      : undefined;
    const company = dto.companyId ? await this.findCompany(dto.companyId, tenantId) : undefined;

    const account = this.accountsRepository.create({
      ...dto,
      tenantId,
      role: dto.role ?? MobileRole.USER,
      departmentId: department?.id,
      companyId: company?.id,
      projects,
    });

    await account.setPassword(dto.password);

    return this.accountsRepository.save(account);
  }

  async findAll(tenantId: string, role?: MobileRole) {
    return this.accountsRepository.find({
      where: { tenantId, ...(role ? { role } : {}) },
      relations: ['projects', 'department', 'company'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateMobileAccountDto) {
    const account = await this.accountsRepository.findOne({
      where: { id, tenantId },
      relations: ['projects'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (dto.login && dto.login !== account.login) {
      await this.ensureLoginUnique(dto.login);
      account.login = dto.login;
    }

    if (dto.fullName !== undefined) account.fullName = dto.fullName;
    if (dto.phoneNumber !== undefined) account.phoneNumber = dto.phoneNumber;
    if (dto.email !== undefined) account.email = dto.email;
    if (dto.profession !== undefined) account.profession = dto.profession;
    if (dto.isActive !== undefined) account.isActive = dto.isActive;
    if (dto.role !== undefined) account.role = dto.role;

    if (dto.password) {
      await account.setPassword(dto.password);
    }

    if (dto.departmentId !== undefined) {
      account.departmentId = dto.departmentId
        ? (await this.findDepartment(dto.departmentId, tenantId)).id
        : null;
    }

    if (dto.companyId !== undefined) {
      account.companyId = dto.companyId ? (await this.findCompany(dto.companyId, tenantId)).id : null;
    }

    if (dto.projectIds) {
      account.projects = await this.findProjects(dto.projectIds, tenantId);
    }

    return this.accountsRepository.save(account);
  }

  private async ensureLoginUnique(login: string) {
    const existing = await this.accountsRepository.findOne({ where: { login } });
    if (existing) {
      throw new ConflictException('Login already in use');
    }
  }

  private async findProjects(ids: string[], tenantId: string) {
    if (!ids?.length) {
      throw new BadRequestException('At least one project is required');
    }
    const projects = await this.projectsRepository.find({
      where: { id: In(ids), tenantId },
    });
    if (projects.length !== ids.length) {
      throw new NotFoundException('One or more projects not found for tenant');
    }
    return projects;
  }

  private async findDepartment(id: string, tenantId: string) {
    const department = await this.departmentsRepository.findOne({
      where: { id, tenantId },
    });
    if (!department) {
      throw new NotFoundException('Department not found for tenant');
    }
    return department;
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

  async findActiveByLogin(login: string) {
    return this.accountsRepository.findOne({
      where: { login, isActive: true },
      relations: ['projects'],
    });
  }

  async findProfile(accountId: string, tenantId: string) {
    const account = await this.accountsRepository.findOne({
      where: { id: accountId, tenantId },
      relations: ['projects', 'department', 'company'],
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async findAllSupervisorsForTenant(tenantId: string) {
    return this.accountsRepository.find({
      where: { tenantId, role: MobileRole.SUPERVISOR, isActive: true },
      select: ['id', 'fullName'],
      order: { fullName: 'ASC' },
    });
  }
}
