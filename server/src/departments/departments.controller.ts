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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/departments')
export class DepartmentsController {
  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(this.getTenantId(req), dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.departmentsService.findAllForTenant(this.getTenantId(req));
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentsService.update(this.getTenantId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.departmentsService.remove(this.getTenantId(req), id);
  }
}
