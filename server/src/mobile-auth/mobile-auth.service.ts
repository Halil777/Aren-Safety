import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MobileAccountsService } from '../mobile-accounts/mobile-accounts.service';
import { MobileLoginDto } from './dto/mobile-login.dto';

@Injectable()
export class MobileAuthService {
  constructor(
    private readonly accountsService: MobileAccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: MobileLoginDto) {
    const account = await this.accountsService.findActiveByLogin(dto.login);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await account.validatePassword(dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: account.id,
      role: account.role,
      tenantId: account.tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user_id: account.id,
      role: account.role,
    };
  }
}
