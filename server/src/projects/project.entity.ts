import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { Department } from '../departments/department.entity';
import { TypeEntity } from '../types/type.entity';
import { Task } from '../tasks/task.entity';
import { Company } from '../companies/company.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Observation } from '../observations/observation.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  startDate?: Date | string | null;

  @Column({ type: 'date', nullable: true })
  endDate?: Date | string | null;

  @Column({ nullable: true })
  projectClient?: string | null;

  @Column({ nullable: true })
  projectLocation?: string | null;

  @Column({ nullable: true })
  projectHead?: string | null;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.projects, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  // eslint-disable-next-line import/no-cycle
  @OneToMany(() => Category, category => category.project)
  categories: Category[];

  @OneToMany(() => Subcategory, subcategory => subcategory.project)
  subcategories: Subcategory[];

  @OneToMany(() => Department, department => department.project)
  departments: Department[];

  // eslint-disable-next-line import/no-cycle
  @OneToMany(() => TypeEntity, type => type.project)
  types: TypeEntity[];

  // eslint-disable-next-line import/no-cycle
  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  // eslint-disable-next-line import/no-cycle
  @OneToMany(() => Company, company => company.project)
  companies: Company[];

  @ManyToMany(() => MobileAccount, account => account.projects)
  mobileAccounts: MobileAccount[];

  @OneToMany(() => Observation, observation => observation.project)
  observations: Observation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
