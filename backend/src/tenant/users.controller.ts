import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

type UserRecord = {
  id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
};

@UseGuards(TenantContextGuard, RolesGuard)
@Controller('tenant/users')
export class UsersController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string) {
    return this.storage.readCollection<UserRecord>(tenantId, 'users');
  }

  private write(tenantId: string, docs: UserRecord[]) {
    return this.storage.writeCollection<UserRecord>(tenantId, 'users', docs);
  }

  @Get()
  list(
    @Req() req: any,
    @Query('role') role?: string,
    @Query('department') department?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    let data = this.read(req.tenantId);

    // Apply filters
    if (role) {
      data = data.filter((d) => d.role === role);
    }
    if (department) {
      data = data.filter((d) => d.department === department);
    }
    if (isActive !== undefined) {
      const active = isActive === 'true';
      data = data.filter((d) => d.isActive === active);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter((d) =>
        d.firstName?.toLowerCase().includes(searchLower) ||
        d.lastName?.toLowerCase().includes(searchLower) ||
        d.email?.toLowerCase().includes(searchLower) ||
        d.username?.toLowerCase().includes(searchLower)
      );
    }

    return data;
  }

  @Get('stats')
  getStats(@Req() req: any) {
    const users = this.read(req.tenantId);

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    const roleDistribution = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const departmentDistribution = users.reduce((acc, user) => {
      if (user.department) {
        acc[user.department] = (acc[user.department] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Recent activity (users who logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyActive = users.filter(u =>
      u.lastLogin && new Date(u.lastLogin) > sevenDaysAgo
    ).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleDistribution,
      departmentDistribution,
      recentlyActive,
    };
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    const user = this.read(req.tenantId).find((d) => d.id === id);
    if (user) {
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return undefined;
  }

  @Post()
  @Roles('admin', 'manager')
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    const now = new Date().toISOString();

    // Check if username already exists
    const all = this.read(req.tenantId);
    const existingUser = all.find(u => u.username === dto.username || u.email === dto.email);
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const doc: UserRecord = {
      id: randomUUID(),
      username: dto.username,
      password: dto.password, // TODO: Hash password in production
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role,
      department: dto.department,
      position: dto.position,
      avatar: dto.avatar,
      isActive: dto.isActive ?? true,
      lastLogin: dto.lastLogin,
      createdAt: now,
      updatedAt: now
    };

    all.push(doc);
    this.write(req.tenantId, all);

    // Don't return password in response
    const { password, ...userWithoutPassword } = doc;
    return userWithoutPassword;
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    const all = this.read(req.tenantId);
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) throw new NotFoundException('User not found');

    // Only update fields that are provided
    const updates: Partial<UserRecord> = {};
    if (dto.username !== undefined) updates.username = dto.username;
    if (dto.password !== undefined) updates.password = dto.password; // TODO: Hash password
    if (dto.email !== undefined) updates.email = dto.email;
    if (dto.firstName !== undefined) updates.firstName = dto.firstName;
    if (dto.lastName !== undefined) updates.lastName = dto.lastName;
    if (dto.phone !== undefined) updates.phone = dto.phone;
    if (dto.role !== undefined) updates.role = dto.role;
    if (dto.department !== undefined) updates.department = dto.department;
    if (dto.position !== undefined) updates.position = dto.position;
    if (dto.avatar !== undefined) updates.avatar = dto.avatar;
    if (dto.isActive !== undefined) updates.isActive = dto.isActive;
    if (dto.lastLogin !== undefined) updates.lastLogin = dto.lastLogin;

    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    this.write(req.tenantId, all);

    // Don't return password in response
    const { password, ...userWithoutPassword } = all[idx];
    return userWithoutPassword;
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Req() req: any, @Param('id') id: string) {
    const all = this.read(req.tenantId);
    const userToDelete = all.find((d) => d.id === id);
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    const filtered = all.filter((d) => d.id !== id);
    this.write(req.tenantId, filtered);
    return { deleted: all.length - filtered.length, message: 'User deleted successfully' };
  }
}
