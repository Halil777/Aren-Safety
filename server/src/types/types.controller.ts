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
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/types')
export class TypesController {
  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  constructor(private readonly typesService: TypesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateTypeDto) {
    return this.typesService.create(this.getTenantId(req), dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.typesService.findAllForTenant(this.getTenantId(req));
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTypeDto) {
    return this.typesService.update(this.getTenantId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.typesService.remove(this.getTenantId(req), id);
  }
}
