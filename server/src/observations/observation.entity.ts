import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { ObservationStatus } from './observation-status';
import { ObservationMedia } from './observationMedia.entity';
import { Company } from '../companies/company.entity';
import { Location } from '../locations/location.entity';
import { Branch } from '../branches/branch.entity';

@Entity('observations')
export class Observation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.observations, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.observations, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ nullable: true })
  locationId?: string | null;

  @ManyToOne(() => Location, { onDelete: 'SET NULL' })
  location?: Location | null;

  @Column()
  departmentId: string;

  @ManyToOne(() => Department, department => department.observations, { onDelete: 'CASCADE' })
  department: Department;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, category => category.observations, { onDelete: 'CASCADE' })
  category: Category;

  @Column({ nullable: true })
  subcategoryId?: string | null;

  @ManyToOne(() => Subcategory, subcategory => subcategory.observations, {
    onDelete: 'SET NULL',
  })
  subcategory?: Subcategory | null;

  @Column({ nullable: true })
  branchId?: string | null;

  @ManyToOne(() => Branch, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branchId', foreignKeyConstraintName: 'FK_observations_branch' })
  branch?: Branch | null;

  @Column()
  createdByUserId: string;

  @ManyToOne(() => MobileAccount, account => account.createdObservations, {
    onDelete: 'CASCADE',
  })
  createdBy: MobileAccount;

  @Column()
  supervisorId: string;

  @ManyToOne(() => MobileAccount, account => account.assignedObservations, {
    onDelete: 'CASCADE',
  })
  supervisor: MobileAccount;

  @Column({ nullable: true })
  companyId?: string | null;

  @ManyToOne(() => Company, {
    onDelete: 'SET NULL',
  })
  company?: Company | null;

  @Column({ type: 'varchar', length: 255 })
  workerFullName: string;

  @Column({ type: 'varchar', length: 255 })
  workerProfession: string;

  @Column({ type: 'int' })
  riskLevel: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ type: 'enum', enum: ObservationStatus, enumName: 'observation_status_enum' })
  status: ObservationStatus;

  @Column({ type: 'timestamp', nullable: true })
  supervisorSeenAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  fixedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  supervisorAnswer?: string | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  answeredAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ObservationMedia, media => media.observation)
  media: ObservationMedia[];
}
