import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObservationsService } from './observations.service';
import { CreateObservationMediaDto } from './dto/create-observation-media.dto';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { MobileRole } from '../mobile-accounts/mobile-role';

@UseGuards(AuthGuard('jwt'))
@Controller('api/observations')
export class ObservationsController {
  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  private getRole(req: any): MobileRole | null {
    return req.user?.role === MobileRole.SUPERVISOR ? MobileRole.SUPERVISOR : null;
  }

  constructor(private readonly observationsService: ObservationsService) {}

  @Get()
  list(@Req() req: any) {
    return this.observationsService.findAllForTenant(
      this.getTenantId(req),
      this.getRole(req),
      req.user?.userId ?? null,
    );
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateObservationDto) {
    return this.observationsService.create(this.getTenantId(req), dto.createdByUserId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateObservationDto) {
    const role = this.getRole(req);
    return this.observationsService.updateStatus(
      this.getTenantId(req),
      role ? req.user?.userId ?? null : null,
      role,
      id,
      dto,
    );
  }

  @Post(':id/media')
  addMedia(@Req() req: any, @Param('id') id: string, @Body() dto: CreateObservationMediaDto) {
    return this.observationsService.addMedia(this.getTenantId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const role = this.getRole(req);
    return this.observationsService.remove(
      this.getTenantId(req),
      id,
      role,
      role ? req.user?.userId ?? null : null,
    );
  }
}
