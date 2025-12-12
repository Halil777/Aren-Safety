import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { MobileRole } from './mobile-role';
import { Observation } from '../observations/observation.entity';
import { ObservationMedia } from '../observations/observationMedia.entity';
import { Company } from '../companies/company.entity';

@Entity('mobile_accounts')
export class MobileAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 50 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 100, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profession?: string | null;

  @Column({ type: 'enum', enum: MobileRole, enumName: 'mobile_role_enum' })
  role: MobileRole;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.mobileAccounts, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @Column({ nullable: true })
  departmentId?: string | null;

  @ManyToOne(() => Department, department => department.mobileAccounts, {
    onDelete: 'SET NULL',
  })
  department?: Department | null;

  @Column({ nullable: true })
  companyId?: string | null;

  @ManyToOne(() => Company, company => company.mobileAccounts, {
    onDelete: 'SET NULL',
  })
  company?: Company | null;

  @ManyToMany(() => Project, project => project.mobileAccounts, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'mobile_accounts_projects',
    joinColumn: { name: 'account_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'project_id', referencedColumnName: 'id' },
  })
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async setPassword(raw: string) {
    this.password = await bcrypt.hash(raw, 10);
  }

  @OneToMany(() => Observation, observation => observation.createdBy)
  createdObservations: Observation[];

  @OneToMany(() => Observation, observation => observation.supervisor)
  assignedObservations: Observation[];

  @OneToMany(() => ObservationMedia, media => media.uploadedBy)
  uploadedMedia: ObservationMedia[];
}
