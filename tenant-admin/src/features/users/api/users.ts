import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { MobileUser, MobileUserInput } from '../types/mobile-user'

export async function fetchMobileUsers(): Promise<MobileUser[]> {
  return apiClient.get<MobileUser[]>(ROUTES.MOBILE_USERS.LIST)
}

export async function createMobileUser(data: MobileUserInput) {
  return apiClient.post<MobileUser>(ROUTES.MOBILE_USERS.LIST, data)
}

export async function updateMobileUser(id: string, data: MobileUserInput) {
  return apiClient.patch<MobileUser>(ROUTES.MOBILE_USERS.DETAIL(id), data)
}
