import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from '../projects/projects.service';
import { DepartmentsService } from '../departments/departments.service';
import { CategoriesService } from '../categories/categories.service';
import { CategoryType } from '../categories/category-type';
import { MobileAccountsService } from './mobile-accounts.service';

@UseGuards(AuthGuard('mobile-jwt'))
@Controller('api/mobile')
export class MobileDataController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly departmentsService: DepartmentsService,
    private readonly categoriesService: CategoriesService,
    private readonly mobileAccountsService: MobileAccountsService,
  ) {}

  @Get('projects')
  async getProjects(@Req() req: any) {
    const projects = await this.projectsService.findAllForTenant(req.user.tenantId);
    return projects.map(p => ({ id: p.id, name: p.name }));
  }

  @Get('departments')
  async getDepartments(@Req() req: any) {
    const departments = await this.departmentsService.findAllForTenant(req.user.tenantId);
    return departments.map(d => ({ id: d.id, name: d.name }));
  }

  @Get('supervisors')
  async getSupervisors(@Req() req: any) {
    const supervisors = await this.mobileAccountsService.findAllSupervisorsForTenant(
      req.user.tenantId,
    );
    return supervisors.map(s => ({ id: s.id, fullName: s.fullName }));
  }

  @Get('categories')
  async getCategories(@Req() req: any) {
    const categories = await this.categoriesService.findAllForTenant(
      req.user.tenantId,
      CategoryType.OBSERVATION,
    );
    return categories.map(c => ({ id: c.id, name: c.categoryName }));
  }

  @Get('subcategories')
  async getSubcategories(@Req() req: any, @Query('categoryId') categoryId?: string) {
    const categories = await this.categoriesService.findAllForTenant(
      req.user.tenantId,
      CategoryType.OBSERVATION,
    );

    if (categoryId) {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return [];
      return (category.subcategories || []).map(sc => ({
        id: sc.id,
        name: sc.subcategoryName,
        categoryId: sc.categoryId,
      }));
    }

    // Return all subcategories if no categoryId specified
    return categories.flatMap(c =>
      (c.subcategories || []).map(sc => ({
        id: sc.id,
        name: sc.subcategoryName,
        categoryId: sc.categoryId,
      })),
    );
  }
}
