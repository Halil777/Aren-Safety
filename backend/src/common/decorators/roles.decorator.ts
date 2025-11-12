import { SetMetadata } from '@nestjs/common';

export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
