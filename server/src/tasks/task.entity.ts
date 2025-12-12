import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  taskName: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.tasks, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  departmentId: string;

  @ManyToOne(() => Department, department => department.tasks, {
    onDelete: 'CASCADE',
  })
  department: Department;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.tasks, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
