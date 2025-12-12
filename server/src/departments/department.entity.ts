import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Observation } from '../observations/observation.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.departments, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.departments, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  // eslint-disable-next-line import/no-cycle
  @OneToMany(() => Task, task => task.department)
  tasks: Task[];

  // eslint-disable-next-line import/no-cycle
  @OneToMany(() => MobileAccount, account => account.department)
  mobileAccounts: MobileAccount[];

  @OneToMany(() => Observation, observation => observation.department)
  observations: Observation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
