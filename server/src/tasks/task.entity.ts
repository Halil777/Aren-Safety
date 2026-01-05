import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Tenant } from "../tenants/tenant.entity";
import { Project } from "../projects/project.entity";
import { Department } from "../departments/department.entity";
import { Category } from "../categories/category.entity";
import { MobileAccount } from "../mobile-accounts/mobile-account.entity";
import { Company } from "../companies/company.entity";
import { TaskStatus } from "./task-status";
import { TaskAttachment } from "./taskAttachment.entity";

@Entity("tasks")
@Index(["tenantId", "createdAt"])
@Index(["tenantId", "projectId"])
@Index(["tenantId", "supervisorId"])
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Tenant
  @Column({ type: "uuid" })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.tasks, {
    onDelete: "CASCADE",
  })
  tenant: Tenant;

  // Project
  @Column({ type: "uuid" })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: "CASCADE",
  })
  project: Project;

  // Department
  @Column({ type: "uuid" })
  departmentId: string;

  @ManyToOne(() => Department, (department) => department.tasks, {
    onDelete: "CASCADE",
  })
  department: Department;

  // Category
  @Column({ type: "uuid" })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.tasks, {
    onDelete: "CASCADE",
  })
  category: Category;

  // Creator (optional for legacy rows; you can backfill later)
  @Column({ type: "uuid", nullable: true })
  createdByUserId?: string | null;

  @ManyToOne(() => MobileAccount, (account) => account.createdTasks, {
    onDelete: "SET NULL",
    nullable: true,
  })
  createdBy?: MobileAccount | null;

  // Supervisor (optional for legacy rows; you can backfill later)
  @Column({ type: "uuid", nullable: true })
  supervisorId?: string | null;

  @ManyToOne(() => MobileAccount, (account) => account.assignedTasks, {
    onDelete: "SET NULL",
    nullable: true,
  })
  supervisor?: MobileAccount | null;

  // Company (optional)
  @Column({ type: "uuid", nullable: true })
  companyId?: string | null;

  @ManyToOne(() => Company, {
    onDelete: "SET NULL",
    nullable: true,
  })
  company?: Company | null;

  // Core fields
  @Column({ type: "text" })
  description: string;

  @Column({ type: "timestamp" })
  deadline: Date;

  // Status: DEFAULT goýmasak, production-da "contains null values" urup biler
  @Column({
    type: "enum",
    enum: TaskStatus,
    enumName: "task_status_enum",
    default: TaskStatus.NEW, // enumyňda NEW bolmadyk bolsa, laýyk initial status goý
  })
  status: TaskStatus;

  // Timeline fields
  @Column({ type: "timestamp", nullable: true })
  supervisorSeenAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  fixedAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  closedAt?: Date | null;

  // Supervisor response fields
  @Column({ type: "text", nullable: true })
  supervisorAnswer?: string | null;

  @Column({ type: "text", nullable: true })
  rejectionReason?: string | null;

  @Column({ type: "timestamp", nullable: true })
  answeredAt?: Date | null;

  // Audit timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Attachments
  @OneToMany(() => TaskAttachment, (media) => media.task)
  media: TaskAttachment[];
}
