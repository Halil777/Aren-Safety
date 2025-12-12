import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationsService } from './observations.service';
import { ObservationsController } from './observations.controller';
import { MobileObservationsController } from './mobile-observations.controller';
import { Observation } from './observation.entity';
import { ObservationMedia } from './observationMedia.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { Company } from '../companies/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Observation,
      ObservationMedia,
      MobileAccount,
      Project,
      Department,
      Category,
      Subcategory,
      Company,
    ]),
  ],
  controllers: [ObservationsController, MobileObservationsController],
  providers: [ObservationsService],
})
export class ObservationsModule {}
