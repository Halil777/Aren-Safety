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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/companies')
export class CompaniesController {
  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(this.getTenantId(req), dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.companiesService.findAllForTenant(this.getTenantId(req));
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.update(this.getTenantId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.companiesService.remove(this.getTenantId(req), id);
  }
}
