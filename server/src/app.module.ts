import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TenantsModule } from "./tenants/tenants.module";
import { AuthModule } from "./auth/auth.module";
import { Tenant } from "./tenants/tenant.entity";
import { MessagesModule } from "./messages/messages.module";
import { Message } from "./messages/message.entity";
import { ProjectsModule } from "./projects/projects.module";
import { Project } from "./projects/project.entity";
import { CategoriesModule } from "./categories/categories.module";
import { Category } from "./categories/category.entity";
import { Subcategory } from "./subcategories/subcategory.entity";
import { SubcategoriesModule } from "./subcategories/subcategories.module";
import { Department } from "./departments/department.entity";
import { DepartmentsModule } from "./departments/departments.module";
import { Branch } from "./branches/branch.entity";
import { BranchesModule } from "./branches/branches.module";
import { Task } from "./tasks/task.entity";
import { TasksModule } from "./tasks/tasks.module";
import { TaskAttachment } from "./tasks/taskAttachment.entity";
import { Company } from "./companies/company.entity";
import { CompaniesModule } from "./companies/companies.module";
import { MobileAccount } from "./mobile-accounts/mobile-account.entity";
import { MobileAccountsModule } from "./mobile-accounts/mobile-accounts.module";
import { MobileAuthModule } from "./mobile-auth/mobile-auth.module";
import { Observation } from "./observations/observation.entity";
import { ObservationMedia } from "./observations/observationMedia.entity";
import { ObservationsModule } from "./observations/observations.module";
import { Location } from "./locations/location.entity";
import { LocationsModule } from "./locations/locations.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load the common .env plus optional local/production overrides if present
      envFilePath: [".env", ".env.local", ".env.production"],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get("NODE_ENV") === "development";

        // Support both discrete credentials and a single DATABASE_URL/DB_URL
        const connectionUrl =
          configService.get<string>("DATABASE_URL") ||
          configService.get<string>("DB_URL");

        const sslEnabled =
          configService.get<string>("DB_SSL", "false") === "true";
        const sslRejectUnauthorized =
          configService.get<string>("DB_SSL_REJECT_UNAUTHORIZED", "true") !==
          "false";

        const connectionConfig = connectionUrl
          ? { url: connectionUrl }
          : {
              host: configService.get<string>("DB_HOST", "127.0.0.1"),
              port: Number(configService.get<string>("DB_PORT", "5432")),
              username: configService.get<string>("DB_USERNAME", "postgres"),
              password: configService.get<string>("DB_PASSWORD", "postgres"),
              database: configService.get<string>(
                "DB_DATABASE",
                "safety_platform"
              ),
            };

        return {
          type: "postgres" as const,
          ...connectionConfig,
          entities: [
            Tenant,
            Message,
            Project,
            Category,
            Subcategory,
            Department,
            Branch,
            Task,
            TaskAttachment,
            Company,
            MobileAccount,
            Observation,
            ObservationMedia,
            Location,
          ],
          synchronize: isDevelopment,
          logging: isDevelopment,
          ssl: sslEnabled
            ? {
                rejectUnauthorized: sslRejectUnauthorized,
              }
            : undefined,
          // pg also looks at extra.ssl; keep in sync with the ssl flag above
          extra: sslEnabled
            ? {
                ssl: { rejectUnauthorized: sslRejectUnauthorized },
                keepAlive: true,
              }
            : { keepAlive: true },
        };
      },
      inject: [ConfigService],
    }),
    TenantsModule,
    AuthModule,
    MessagesModule,
    ProjectsModule,
    CategoriesModule,
    SubcategoriesModule,
    DepartmentsModule,
    BranchesModule,
    TasksModule,
    CompaniesModule,
    MobileAccountsModule,
    MobileAuthModule,
    ObservationsModule,
    LocationsModule,
  ],
})
export class AppModule {}
