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
import { Subcategory } from '../subcategories/subcategory.entity';
import { CategoryType } from './category-type';
import { Observation } from '../observations/observation.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CategoryType, enumName: 'category_type_enum' })
  type: CategoryType;

  @Column({ type: 'varchar', length: 255 })
  categoryName: string;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.categories, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.categories, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @OneToMany(() => Subcategory, subcategory => subcategory.category)
  subcategories: Subcategory[];

  @OneToMany(() => Observation, observation => observation.category)
  observations: Observation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
