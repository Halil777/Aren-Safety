import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import {
  type CreateTenantInput,
  type Tenant,
  type UpdateTenantInput,
} from '../types/tenant'

const BASE = ROUTES.TENANTS

export const TENANTS_QUERY_KEY = 'tenants'

export const fetchTenants = () => apiClient.get<Tenant[]>(BASE.LIST)

export const fetchTenant = (id: string) =>
  apiClient.get<Tenant>(BASE.DETAILS(id))

export const createTenant = (input: CreateTenantInput) =>
  apiClient.post<Tenant>(BASE.CREATE, input)

export const updateTenant = (id: string, input: UpdateTenantInput) =>
  apiClient.patch<Tenant>(BASE.UPDATE(id), input)

export const deleteTenant = (id: string) =>
  apiClient.delete<void>(BASE.DELETE(id))
