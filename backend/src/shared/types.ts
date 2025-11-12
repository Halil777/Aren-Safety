export type LocaleString = string;

export interface TenantAdmin {
  id: string;
  login: string; // username/login for authentication
  email?: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  createdAt: string;
}

export interface TenantRecord {
  id: string;
  slug: string;
  title: LocaleString;
  createdAt: string;
  updatedAt: string;
  admins: TenantAdmin[];
}
