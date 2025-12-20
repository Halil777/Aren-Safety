import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Tenant } from "../tenants/tenant.entity";
import { Project } from "../projects/project.entity";
import { Department } from "../departments/department.entity";
import { Category } from "../categories/category.entity";
import { Subcategory } from "../subcategories/subcategory.entity";
import { MobileAccount } from "../mobile-accounts/mobile-account.entity";
import { Company } from "../companies/company.entity";
import { TaskStatus } from "./task-status";
import { TaskAttachment } from "./taskAttachment.entity";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.tasks, {
    onDelete: "CASCADE",
  })
  tenant: Tenant;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: "CASCADE",
  })
  project: Project;

  @Column()
  departmentId: string;

  @ManyToOne(() => Department, (department) => department.tasks, {
    onDelete: "CASCADE",
  })
  department: Department;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.tasks, {
    onDelete: "CASCADE",
  })
  category: Category;

  @Column({ nullable: true })
  subcategoryId?: string | null;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.tasks, {
    onDelete: "SET NULL",
  })
  subcategory?: Subcategory | null;

  @Column({ nullable: true })
  createdByUserId?: string | null;

  @ManyToOne(() => MobileAccount, (account) => account.createdTasks, {
    onDelete: "CASCADE",
  })
  createdBy?: MobileAccount | null;

  @Column()
  supervisorId: string;

  @ManyToOne(() => MobileAccount, (account) => account.assignedTasks, {
    onDelete: "CASCADE",
  })
  supervisor: MobileAccount;

  @Column({ nullable: true })
  companyId?: string | null;

  @ManyToOne(() => Company, {
    onDelete: "SET NULL",
  })
  company?: Company | null;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "timestamp" })
  deadline: Date;

  @Column({ type: "enum", enum: TaskStatus, enumName: "task_status_enum" })
  status: TaskStatus;

  @Column({ type: "timestamp", nullable: true })
  supervisorSeenAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  fixedAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  closedAt?: Date | null;

  @Column({ type: "text", nullable: true })
  supervisorAnswer?: string | null;

  @Column({ type: "text", nullable: true })
  rejectionReason?: string | null;

  @Column({ type: "timestamp", nullable: true })
  answeredAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TaskAttachment, (media) => media.task)
  media: TaskAttachment[];
}
