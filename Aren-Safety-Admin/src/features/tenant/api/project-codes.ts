import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/shared/api/axios-instance';

export type ProjectCode = {
  id: string;
  code: string;
  title_en: string;
  title_ru: string;
  title_tr: string;
  client?: string;
  startDate?: string;
  endDate?: string;
  headOfProject?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

const keys = {
  all: ['tenant-project-codes'] as const,
  list: () => [...keys.all, 'list'] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
};

export function useProjectCodesQuery() {
  return useQuery({
    queryKey: keys.list(),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProjectCode[]>('/tenant/project-codes');
      return data;
    },
  });
}

export function useCreateProjectCodeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...keys.all, 'create'],
    mutationFn: async (payload: Omit<ProjectCode, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await axiosInstance.post<ProjectCode>('/tenant/project-codes', payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.list() }),
  });
}

export function useUpdateProjectCodeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...keys.all, 'update'],
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Omit<ProjectCode, 'id' | 'createdAt' | 'updatedAt'>> }) => {
      const { data } = await axiosInstance.patch<ProjectCode>(`/tenant/project-codes/${id}`, payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.list() }),
  });
}

export function useDeleteProjectCodeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...keys.all, 'delete'],
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/tenant/project-codes/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.list() }),
  });
}

