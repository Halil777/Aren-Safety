import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BillingStatus, Plan, Tenant, TenantStatus } from './tenant.entity'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { MailService } from '../notifications/mail.service'

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    private readonly mailService: MailService,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await this.tenantsRepository.findOne({
      where: { email: createTenantDto.email },
    })

    if (existingTenant) {
      throw new ConflictException('Email already exists')
    }

    const now = new Date()
    const defaultTrialEndsAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14)

    const tenant = this.tenantsRepository.create({
      ...createTenantDto,
      status: createTenantDto.status ?? TenantStatus.TRIAL,
      billingStatus: createTenantDto.billingStatus ?? BillingStatus.TRIAL,
      trialEndsAt: createTenantDto.trialEndsAt
        ? new Date(createTenantDto.trialEndsAt)
        : defaultTrialEndsAt,
      paidUntil: createTenantDto.paidUntil ? new Date(createTenantDto.paidUntil) : null,
      plan: createTenantDto.plan ?? Plan.BASIC,
    })

    const saved = await this.tenantsRepository.save(tenant)
    await this.mailService.sendTenantStatusChange(saved, saved.status)
    return saved
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find({
      select: [
        'id',
        'fullname',
        'email',
        'phoneNumber',
        'status',
        'billingStatus',
        'trialEndsAt',
        'paidUntil',
        'plan',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id },
      select: [
        'id',
        'fullname',
        'email',
        'phoneNumber',
        'status',
        'billingStatus',
        'trialEndsAt',
        'paidUntil',
        'plan',
        'createdAt',
        'updatedAt',
      ],
    })

    if (!tenant) {
      throw new NotFoundException('Tenant not found')
    }

    return tenant
  }

  async findByEmail(email: string): Promise<Tenant | null> {
    return this.tenantsRepository.findOne({ where: { email } })
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({ where: { id } })

    if (!tenant) {
      throw new NotFoundException('Tenant not found')
    }

    const previousStatus = tenant.status

    if (updateTenantDto.email && updateTenantDto.email !== tenant.email) {
      const existingTenant = await this.tenantsRepository.findOne({
        where: { email: updateTenantDto.email },
      })

      if (existingTenant) {
        throw new ConflictException('Email already exists')
      }
    }

    const updateData: Partial<Tenant> = { ...updateTenantDto }

    if (!updateTenantDto.password || updateTenantDto.password.trim() === '') {
      delete (updateData as any).password
    }

    if (updateTenantDto.trialEndsAt) {
      updateData.trialEndsAt = new Date(updateTenantDto.trialEndsAt)
    }

    if (updateTenantDto.paidUntil) {
      updateData.paidUntil = new Date(updateTenantDto.paidUntil)
    }

    Object.assign(tenant, updateData)
    await this.ensureTenantAccessState(tenant)
    const saved = await this.tenantsRepository.save(tenant)

    if (saved.status !== previousStatus) {
      await this.mailService.sendTenantStatusChange(saved, saved.status)
    }

    return saved
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id)
    await this.tenantsRepository.remove(tenant)
  }

  async getStatistics() {
    const total = await this.tenantsRepository.count()
    const active = await this.tenantsRepository.count({
      where: { status: TenantStatus.ACTIVE },
    })
    const suspended = await this.tenantsRepository.count({
      where: { status: TenantStatus.SUSPENDED },
    })

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const tenantsOverTime = await this.tenantsRepository
      .createQueryBuilder('tenant')
      .select("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('tenant.createdAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy("TO_CHAR(tenant.createdAt, 'YYYY-MM')")
      .orderBy("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'ASC')
      .getRawMany()

    const statusOverTime = await this.tenantsRepository
      .createQueryBuilder('tenant')
      .select("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'month')
      .addSelect('tenant.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('tenant.createdAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy("TO_CHAR(tenant.createdAt, 'YYYY-MM'), tenant.status")
      .orderBy("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'ASC')
      .getRawMany()

    return {
      total,
      active,
      suspended,
      growthData: tenantsOverTime.map((item) => ({
        month: item.month,
        count: parseInt(item.count, 10),
      })),
      statusData: statusOverTime.map((item) => ({
        month: item.month,
        status: item.status,
        count: parseInt(item.count, 10),
      })),
    }
  }

  async ensureTenantAccessState(tenant: Tenant): Promise<Tenant> {
    const now = new Date()
    let statusChanged = false
    let billingChanged = false

    const trialValid =
      tenant.billingStatus === BillingStatus.TRIAL &&
      tenant.trialEndsAt !== null &&
      new Date(tenant.trialEndsAt).getTime() > now.getTime()

    const paidValid =
      tenant.billingStatus === BillingStatus.PAID &&
      tenant.paidUntil !== null &&
      new Date(tenant.paidUntil).getTime() > now.getTime()

    if (tenant.status === TenantStatus.DISABLED) {
      return tenant
    }

    if (trialValid || paidValid) {
      const nextStatus =
        tenant.status === TenantStatus.SUSPENDED ? TenantStatus.ACTIVE : tenant.status
      if (nextStatus !== tenant.status) {
        tenant.status = nextStatus
        statusChanged = true
      }
    } else {
      if (
        tenant.billingStatus === BillingStatus.TRIAL &&
        (!tenant.trialEndsAt || new Date(tenant.trialEndsAt).getTime() <= now.getTime())
      ) {
        tenant.billingStatus = BillingStatus.TRIAL_EXPIRED
        billingChanged = true
      } else if (
        tenant.billingStatus === BillingStatus.PAID &&
        (!tenant.paidUntil || new Date(tenant.paidUntil).getTime() <= now.getTime())
      ) {
        tenant.billingStatus = BillingStatus.OVERDUE
        billingChanged = true
      }

      if (tenant.status !== TenantStatus.SUSPENDED) {
        tenant.status = TenantStatus.SUSPENDED
        statusChanged = true
      }
    }

    if (statusChanged || billingChanged) {
      await this.tenantsRepository.save(tenant)
    }

    return tenant
  }
}
