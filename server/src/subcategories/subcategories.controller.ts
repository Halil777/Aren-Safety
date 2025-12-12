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
import { SubcategoriesService } from './subcategories.service';
import { CategoryType } from '../categories/category-type';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post('observation-subcategories')
  createObservation(@Req() req: any, @Body() dto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(
      req.user.userId,
      CategoryType.OBSERVATION,
      dto,
    );
  }

  @Get('observation-subcategories')
  findObservation(@Req() req: any) {
    return this.subcategoriesService.findAllForTenant(
      req.user.userId,
      CategoryType.OBSERVATION,
    );
  }

  @Patch('observation-subcategories/:id')
  updateObservation(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(
      req.user.userId,
      id,
      CategoryType.OBSERVATION,
      dto,
    );
  }

  @Delete('observation-subcategories/:id')
  removeObservation(@Req() req: any, @Param('id') id: string) {
    return this.subcategoriesService.remove(
      req.user.userId,
      id,
      CategoryType.OBSERVATION,
    );
  }

  @Post('task-subcategories')
  createTask(@Req() req: any, @Body() dto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(req.user.userId, CategoryType.TASK, dto);
  }

  @Get('task-subcategories')
  findTask(@Req() req: any) {
    return this.subcategoriesService.findAllForTenant(
      req.user.userId,
      CategoryType.TASK,
    );
  }

  @Patch('task-subcategories/:id')
  updateTask(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(
      req.user.userId,
      id,
      CategoryType.TASK,
      dto,
    );
  }

  @Delete('task-subcategories/:id')
  removeTask(@Req() req: any, @Param('id') id: string) {
    return this.subcategoriesService.remove(req.user.userId, id, CategoryType.TASK);
  }
}
