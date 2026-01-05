import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
import { TaskAttachment } from './taskAttachment.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Company } from '../companies/company.entity';
import { MobileTasksController } from './mobile-tasks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskAttachment,
      Project,
      Department,
      Category,
      MobileAccount,
      Company,
    ]),
  ],
  controllers: [TasksController, MobileTasksController],
  providers: [TasksService],
})
export class TasksModule {}
