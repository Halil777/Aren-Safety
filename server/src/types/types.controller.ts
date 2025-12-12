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
  constructor(private readonly typesService: TypesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateTypeDto) {
    return this.typesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.typesService.findAllForTenant(req.user.userId);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTypeDto) {
    return this.typesService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.typesService.remove(req.user.userId, id);
  }
}
