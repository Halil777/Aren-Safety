import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileAccountsService } from './mobile-accounts.service';
import { MobileAccountsController } from './mobile-accounts.controller';
import { MobileAccount } from './mobile-account.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Company } from '../companies/company.entity';
import { MobileProfileController } from './mobile-profile.controller';
import { MobileDataController } from './mobile-data.controller';
import { ProjectsModule } from '../projects/projects.module';
import { DepartmentsModule } from '../departments/departments.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MobileAccount, Project, Department, Company]),
    ProjectsModule,
    DepartmentsModule,
    CategoriesModule,
  ],
  controllers: [MobileAccountsController, MobileProfileController, MobileDataController],
  providers: [MobileAccountsService],
  exports: [MobileAccountsService],
})
export class MobileAccountsModule {}
