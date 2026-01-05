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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/locations')
export class LocationsController {
  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateLocationDto) {
    return this.locationsService.create(this.getTenantId(req), dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.locationsService.findAllForTenant(this.getTenantId(req));
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.locationsService.update(this.getTenantId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.locationsService.remove(this.getTenantId(req), id);
  }
}
