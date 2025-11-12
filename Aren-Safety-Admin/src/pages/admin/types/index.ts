import type { UserRole, Permission } from '@/shared/types/tenant';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  position?: string;
  isActive: boolean;
  permissions?: Permission[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  position?: string;
  isActive: boolean;
  permissions?: Permission[];
}
