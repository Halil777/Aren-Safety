import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [AuthController],
})
export class AuthModule {}
