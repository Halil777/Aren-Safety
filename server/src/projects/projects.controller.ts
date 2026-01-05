import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/projects')
export class ProjectsController {
  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(this.getTenantId(req), createProjectDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.projectsService.findAllForTenant(this.getTenantId(req));
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(this.getTenantId(req), id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.remove(this.getTenantId(req), id);
  }
}
