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

@Entity('types')
export class TypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  typeName: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, project => project.types, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, tenant => tenant.types, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
