import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Project } from '../projects/project.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { Department } from '../departments/department.entity';
import { Branch } from '../branches/branch.entity';
import { Task } from '../tasks/task.entity';
import { Company } from '../companies/company.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Observation } from '../observations/observation.entity';

export enum TenantStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  SUSPENDED = 'suspended',
  DISABLED = 'disabled',
}

export enum BillingStatus {
  TRIAL = 'trial',
  TRIAL_EXPIRED = 'trial_expired',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum Plan {
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fullname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.TRIAL,
  })
  status: TenantStatus;

  @Column({
    type: 'enum',
    enum: BillingStatus,
    default: BillingStatus.TRIAL,
  })
  billingStatus: BillingStatus;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  paidUntil: Date | null;

  @Column({ type: 'enum', enum: Plan, default: Plan.BASIC })
  plan: Plan;

  @OneToMany(() => Project, project => project.tenant)
  projects: Project[];

  @OneToMany(() => Category, category => category.tenant)
  categories: Category[];

  @OneToMany(() => Subcategory, subcategory => subcategory.tenant)
  subcategories: Subcategory[];

  @OneToMany(() => Department, department => department.tenant)
  departments: Department[];

  @OneToMany(() => Branch, branch => branch.tenant)
  branches: Branch[];

  @OneToMany(() => Task, task => task.tenant)
  tasks: Task[];

  @OneToMany(() => Company, company => company.tenant)
  companies: Company[];

  @OneToMany(() => MobileAccount, account => account.tenant)
  mobileAccounts: MobileAccount[];

  @OneToMany(() => Observation, observation => observation.tenant)
  observations: Observation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
