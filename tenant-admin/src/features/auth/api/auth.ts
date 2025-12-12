import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { TenantProfile } from '@/shared/types/auth'
import type { AuthResponse, LoginInput } from '../types/auth'

export const login = (input: LoginInput) => apiClient.post<AuthResponse>(ROUTES.AUTH.LOGIN, input)

export const fetchProfile = () => apiClient.get<TenantProfile>(ROUTES.AUTH.ME)
