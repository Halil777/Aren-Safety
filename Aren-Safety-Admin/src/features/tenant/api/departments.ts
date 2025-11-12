import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/shared/api/axios-instance';

export type Department = {
  id: string;
  title_en: string;
  title_ru: string;
  title_tr: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

const keys = {
  all: ['tenant-departments'] as const,
  list: () => [...keys.all, 'list'] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
};

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: keys.list(),
    queryFn: async () => {
      const { data } = await axiosInstance.get<Department[]>('/tenant/departments');
      return data;
    },
  });
}

export function useCreateDepartmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...keys.all, 'create'],
    mutationFn: async (payload: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await axiosInstance.post<Department>('/tenant/departments', payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.list() }),
  });
}

export function useUpdateDepartmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...keys.all, 'update'],
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Omit<Department, 'id' | 'createdAt' | 'updatedAt'>> }) => {
      const { data } = await axiosInstance.patch<Department>(`/tenant/departments/${id}`, payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.list() }),
  });
}

export function useDeleteDepartmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...keys.all, 'delete'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/tenant/departments/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.list() }),
  });
}

