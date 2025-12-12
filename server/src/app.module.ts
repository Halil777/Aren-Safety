import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { Tenant } from './tenants/tenant.entity';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/message.entity';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/project.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { Subcategory } from './subcategories/subcategory.entity';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { Department } from './departments/department.entity';
import { DepartmentsModule } from './departments/departments.module';
import { TypeEntity } from './types/type.entity';
import { TypesModule } from './types/types.module';
import { Task } from './tasks/task.entity';
import { TasksModule } from './tasks/tasks.module';
import { Company } from './companies/company.entity';
import { CompaniesModule } from './companies/companies.module';
import { MobileAccount } from './mobile-accounts/mobile-account.entity';
import { MobileAccountsModule } from './mobile-accounts/mobile-accounts.module';
import { MobileAuthModule } from './mobile-auth/mobile-auth.module';
import { Observation } from './observations/observation.entity';
import { ObservationMedia } from './observations/observationMedia.entity';
import { ObservationsModule } from './observations/observations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'safety_platform'),
        entities: [
          Tenant,
          Message,
          Project,
          Category,
          Subcategory,
          Department,
          TypeEntity,
          Task,
          Company,
          MobileAccount,
          Observation,
          ObservationMedia,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TenantsModule,
    AuthModule,
    MessagesModule,
    ProjectsModule,
    CategoriesModule,
    SubcategoriesModule,
    DepartmentsModule,
    TypesModule,
    TasksModule,
    CompaniesModule,
    MobileAccountsModule,
    MobileAuthModule,
    ObservationsModule,
  ],
})
export class AppModule {}
