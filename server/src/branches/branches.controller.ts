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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/branches')
export class BranchesController {
  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateBranchDto) {
    return this.branchesService.create(this.getTenantId(req), dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.branchesService.findAllForTenant(this.getTenantId(req));
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchesService.update(this.getTenantId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.branchesService.remove(this.getTenantId(req), id);
  }
}
