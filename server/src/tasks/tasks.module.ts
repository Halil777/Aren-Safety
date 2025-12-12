import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, Department, Category])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
