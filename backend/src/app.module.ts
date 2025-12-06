import "dotenv/config";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { SuperAdminModule } from "./super-admin/super-admin.module";
import { DepartmentsController } from "./tenant/departments.controller";
import { ProjectCodesController } from "./tenant/project-codes.controller";
import { ObservationsController } from "./tenant/observations.controller";
import { TrainingController } from "./tenant/training.controller";
import { EmployeesController } from "./tenant/employees.controller";
import { SettingsController } from "./tenant/settings.controller";
import { UsersController } from "./tenant/users.controller";
import { SupervisorsController } from "./tenant/supervisors.controller";
import { CategoriesController } from "./tenant/categories.controller";
import { BranchesController } from "./tenant/branches.controller";
import { UserRolesController } from "./tenant/user-roles.controller";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Conditionally enable DB
    ...(process.env.DB_DISABLED === "true"
      ? []
      : [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: "postgres",
              host: config.get<string>("DB_HOST", "localhost"),
              port: parseInt(config.get<string>("DB_PORT", "5432"), 10),
              username: config.get<string>("DB_USERNAME", "postgres"),
              password: config.get<string>("DB_PASSWORD", "postgres"),
              database: config.get<string>("DB_NAME", "safety"),
              schema: config.get<string>("DB_SCHEMA", "public"),
              ssl:
                config.get<string>("DB_SSL", "false") === "true"
                  ? { rejectUnauthorized: false }
                  : false,
              autoLoadEntities: true,
              synchronize: false,
              logging: config.get<string>("NODE_ENV") !== "production",
            }),
          }),
        ]),
    ...(process.env.DB_DISABLED === "true" ? [] : [UsersModule]),
    StorageModule,
    AuthModule,
    SuperAdminModule,
  ],
  controllers: [
    AppController,
    DepartmentsController,
    ProjectCodesController,
    ObservationsController,
    TrainingController,
    EmployeesController,
    SettingsController,
    UsersController,
    SupervisorsController,
    CategoriesController,
    BranchesController,
    UserRolesController,
  ],
  providers: [AppService],
})
export class AppModule {}
