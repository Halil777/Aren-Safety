import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObservationsService } from './observations.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { MobileRole } from '../mobile-accounts/mobile-role';
import { AnswerObservationDto } from './dto/answer-observation.dto';

@UseGuards(AuthGuard('mobile-jwt'))
@Controller('api/mobile/observations')
export class MobileObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Get()
  list(@Req() req: any) {
    return this.observationsService.findForMobile(req.user.mobileAccountId, req.user.role);
  }

  @Get(':id')
  getOne(@Req() req: any, @Param('id') id: string) {
    return this.observationsService.findOneForMobile(req.user.mobileAccountId, req.user.role, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateObservationDto) {
    if (req.user.role !== MobileRole.USER) {
      throw new Error('Only users can create observations');
    }
    return this.observationsService.create(req.user.tenantId, req.user.mobileAccountId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateObservationDto) {
    return this.observationsService.updateStatus(
      req.user.tenantId,
      req.user.mobileAccountId,
      req.user.role,
      id,
      dto,
    );
  }

  @Post(':id/answer')
  answer(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AnswerObservationDto,
  ) {
    return this.observationsService.answerObservation(
      req.user.tenantId,
      req.user.mobileAccountId,
      req.user.role,
      id,
      dto,
    );
  }
}
