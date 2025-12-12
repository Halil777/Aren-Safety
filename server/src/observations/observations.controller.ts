import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObservationsService } from './observations.service';
import { CreateObservationMediaDto } from './dto/create-observation-media.dto';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/observations')
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Get()
  list(@Req() req: any) {
    return this.observationsService.findAllForTenant(req.user.userId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateObservationDto) {
    return this.observationsService.create(req.user.userId, dto.createdByUserId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateObservationDto) {
    return this.observationsService.updateStatus(
      req.user.userId,
      null,
      null,
      id,
      dto,
    );
  }

  @Post(':id/media')
  addMedia(@Req() req: any, @Param('id') id: string, @Body() dto: CreateObservationMediaDto) {
    return this.observationsService.addMedia(req.user.userId, id, dto);
  }
}
