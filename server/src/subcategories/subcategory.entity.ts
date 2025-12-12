import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Project } from '../projects/project.entity';
import { Tenant } from '../tenants/tenant.entity';
import { CategoryType } from '../categories/category-type';
import { Observation } from '../observations/observation.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CategoryType, enumName: 'subcategory_type_enum' })
  type: CategoryType;

  @Column({ type: 'varchar', length: 255 })
  subcategoryName: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, category => category.subcategories, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.subcategories, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.subcategories, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @OneToMany(() => Observation, observation => observation.subcategory)
  observations: Observation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
