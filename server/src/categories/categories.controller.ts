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
import { CategoriesService } from './categories.service';
import { CategoryType } from './category-type';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('observation-categories')
  createObservation(@Req() req: any, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.userId, CategoryType.OBSERVATION, dto);
  }

  @Get('observation-categories')
  findObservation(@Req() req: any) {
    return this.categoriesService.findAllForTenant(
      req.user.userId,
      CategoryType.OBSERVATION,
    );
  }

  @Patch('observation-categories/:id')
  updateObservation(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
      req.user.userId,
      id,
      CategoryType.OBSERVATION,
      dto,
    );
  }

  @Delete('observation-categories/:id')
  removeObservation(@Req() req: any, @Param('id') id: string) {
    return this.categoriesService.remove(
      req.user.userId,
      id,
      CategoryType.OBSERVATION,
    );
  }

  @Post('task-categories')
  createTask(@Req() req: any, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.userId, CategoryType.TASK, dto);
  }

  @Get('task-categories')
  findTask(@Req() req: any) {
    return this.categoriesService.findAllForTenant(req.user.userId, CategoryType.TASK);
  }

  @Patch('task-categories/:id')
  updateTask(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(req.user.userId, id, CategoryType.TASK, dto);
  }

  @Delete('task-categories/:id')
  removeTask(@Req() req: any, @Param('id') id: string) {
    return this.categoriesService.remove(req.user.userId, id, CategoryType.TASK);
  }
}
