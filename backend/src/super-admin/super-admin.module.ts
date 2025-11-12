import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { StorageModule } from '../storage/storage.module';
import { SuperAdminGuard } from '../auth/super-admin.guard';

@Module({
  imports: [StorageModule],
  controllers: [SuperAdminController],
  providers: [SuperAdminGuard],
})
export class SuperAdminModule {}

