import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';

@Injectable()
export class MobileJwtStrategy extends PassportStrategy(Strategy, 'mobile-jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(MobileAccount)
    private readonly accountsRepository: Repository<MobileAccount>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret-key'),
    });
  }

  async validate(payload: any) {
    const account = await this.accountsRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });
    if (!account) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      userId: account.id,
      mobileAccountId: account.id,
      role: payload.role,
      tenantId: account.tenantId,
    };
  }
}
