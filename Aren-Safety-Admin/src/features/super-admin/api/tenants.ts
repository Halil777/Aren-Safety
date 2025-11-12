import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/shared/api/axios-instance';

export type TenantAdmin = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type Tenant = {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  admins: TenantAdmin[];
};

export const tenantsKeys = {
  all: ['sa-tenants'] as const,
  list: () => [...tenantsKeys.all, 'list'] as const,
  detail: (id: string) => [...tenantsKeys.all, 'detail', id] as const,
};

export function useTenantsQuery() {
  return useQuery({
    queryKey: tenantsKeys.list(),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Tenant[]>('/super-admin/tenants');
      return data;
    },
  });
}

export function useTenantQuery(id: string) {
  return useQuery({
    queryKey: tenantsKeys.detail(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Tenant>(`/super-admin/tenants/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

type CreateTenantPayload = {
  slug: string;
  title: string;
  adminLogin?: string;
  adminPassword?: string;
  adminEmail?: string;
  adminFirstName?: string;
  adminLastName?: string;
};

export function useCreateTenantMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...tenantsKeys.all, 'create'],
    mutationFn: async (payload: CreateTenantPayload) => {
      const { data } = await axiosInstance.post<Tenant>('/super-admin/tenants', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
    },
  });
}

type UpdateTenantPayload = Partial<Omit<CreateTenantPayload, 'slug'>> & { slug?: string };

export function useUpdateTenantMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...tenantsKeys.all, 'update', id],
    mutationFn: async (payload: UpdateTenantPayload) => {
      const { data } = await axiosInstance.patch<Tenant>(`/super-admin/tenants/${id}`, payload);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
      qc.setQueryData(tenantsKeys.detail(id), data);
    },
  });
}

export function useDeleteTenantMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...tenantsKeys.all, 'delete'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete<{ deleted: number }>(`/super-admin/tenants/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantsKeys.list() });
    },
  });
}

type CreateTenantAdminPayload = { email: string; firstName: string; lastName: string };

export function useCreateTenantAdminMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...tenantsKeys.all, 'create-admin', id],
    mutationFn: async (payload: CreateTenantAdminPayload) => {
      const { data } = await axiosInstance.post<TenantAdmin>(`/super-admin/tenants/${id}/admins`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantsKeys.detail(id) });
    },
  });
}
