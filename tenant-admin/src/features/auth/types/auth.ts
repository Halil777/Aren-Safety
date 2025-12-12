import type { TenantProfile } from '@/shared/types/auth'

export type LoginInput = {
  email: string
  password: string
}

export type AuthResponse = {
  access_token: string
  tenant: TenantProfile
}
