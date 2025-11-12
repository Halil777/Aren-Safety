export class UpdateAdminUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
  permissions?: string[];
}
