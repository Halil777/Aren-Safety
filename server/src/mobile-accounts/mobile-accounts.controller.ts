import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MobileAccountsService } from './mobile-accounts.service';
import { CreateMobileAccountDto } from './dto/create-mobile-account.dto';
import { UpdateMobileAccountDto } from './dto/update-mobile-account.dto';
import { MobileRole } from './mobile-role';

@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class MobileAccountsController {
  constructor(private readonly accountsService: MobileAccountsService) {}

  @Post('mobile-users')
  createUser(@Req() req: any, @Body() dto: CreateMobileAccountDto) {
    return this.accountsService.create(req.user.userId, {
      ...dto,
      role: MobileRole.USER,
    });
  }

  @Post('supervisors')
  createSupervisor(@Req() req: any, @Body() dto: CreateMobileAccountDto) {
    return this.accountsService.create(req.user.userId, {
      ...dto,
      role: MobileRole.SUPERVISOR,
    });
  }

  @Get('mobile-users')
  listUsers(@Req() req: any) {
    return this.accountsService.findAll(req.user.userId, MobileRole.USER);
  }

  @Get('supervisors')
  listSupervisors(@Req() req: any) {
    return this.accountsService.findAll(req.user.userId, MobileRole.SUPERVISOR);
  }

  @Patch('mobile-users/:id')
  updateUser(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMobileAccountDto) {
    return this.accountsService.update(req.user.userId, id, {
      ...dto,
      role: dto.role ?? MobileRole.USER,
    });
  }

  @Patch('supervisors/:id')
  updateSupervisor(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateMobileAccountDto,
  ) {
    return this.accountsService.update(req.user.userId, id, {
      ...dto,
      role: dto.role ?? MobileRole.SUPERVISOR,
    });
  }
}
