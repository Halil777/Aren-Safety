import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MobileAccountsService } from './mobile-accounts.service';

@UseGuards(AuthGuard('mobile-jwt'))
@Controller('api/mobile/profile')
export class MobileProfileController {
  constructor(private readonly accountsService: MobileAccountsService) {}

  @Get()
  getProfile(@Req() req: any) {
    return this.accountsService.findProfile(req.user.mobileAccountId, req.user.tenantId).then(account => ({
      id: account.id,
      fullName: account.fullName,
      phoneNumber: account.phoneNumber,
      email: account.email,
      profession: account.profession,
      role: account.role,
      projectName: account.projects?.[0]?.name,
      projects: account.projects?.map(p => ({ id: p.id, name: p.name })) ?? [],
      companyName: (account.company as any)?.companyName ?? null,
      company: account.company
        ? { id: account.company.id, name: (account.company as any).companyName }
        : null,
    }));
  }
}
