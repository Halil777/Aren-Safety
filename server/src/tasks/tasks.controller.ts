import {
  BadRequestException,
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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskMediaDto } from './dto/create-task-media.dto';
import { MobileRole } from '../mobile-accounts/mobile-role';

@UseGuards(AuthGuard('jwt'))
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private getTenantId(req: any) {
    return req.user?.tenantId ?? req.user?.userId;
  }

  private getRole(req: any): MobileRole | null {
    return req.user?.role === MobileRole.SUPERVISOR ? MobileRole.SUPERVISOR : null;
  }

  @Get()
  list(@Req() req: any) {
    return this.tasksService.findAllForTenant(
      this.getTenantId(req),
      this.getRole(req),
      req.user?.userId ?? null,
    );
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    if (!dto.createdByUserId) {
      throw new BadRequestException('createdByUserId is required');
    }
    return this.tasksService.create(this.getTenantId(req), dto.createdByUserId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const role = this.getRole(req);
    return this.tasksService.updateStatus(
      this.getTenantId(req),
      role ? req.user?.userId ?? null : null,
      role,
      id,
      dto,
    );
  }

  @Post(':id/media')
  addMedia(@Req() req: any, @Param('id') id: string, @Body() dto: CreateTaskMediaDto) {
    return this.tasksService.addMedia(this.getTenantId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.tasksService.remove(this.getTenantId(req), id);
  }
}
