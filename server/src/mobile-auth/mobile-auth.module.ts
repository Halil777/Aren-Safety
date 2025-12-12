import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MobileAuthService } from './mobile-auth.service';
import { MobileAuthController } from './mobile-auth.controller';
import { MobileJwtStrategy } from './mobile-jwt.strategy';
import { MobileAccountsModule } from '../mobile-accounts/mobile-accounts.module';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([MobileAccount]),
    MobileAccountsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret-key'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any },
      }),
    }),
  ],
  controllers: [MobileAuthController],
  providers: [MobileAuthService, MobileJwtStrategy],
})
export class MobileAuthModule {}
