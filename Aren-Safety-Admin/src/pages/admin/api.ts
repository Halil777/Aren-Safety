import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';
import type { AdminUser, UserFormData } from './types';

// Query Keys
export const adminUsersKeys = {
  all: ['admin-users'] as const,
  list: () => [...adminUsersKeys.all, 'list'] as const,
  detail: (id: string) => [...adminUsersKeys.all, 'detail', id] as const,
};

// API Functions
const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const { data } = await axios.get('/tenant/admin-users');
  return data;
};

const fetchAdminUser = async (id: string): Promise<AdminUser> => {
  const { data } = await axios.get(`/tenant/admin-users/${id}`);
  return data;
};

const createAdminUser = async (userData: UserFormData): Promise<AdminUser> => {
  const { data } = await axios.post('/tenant/admin-users', userData);
  return data;
};

const updateAdminUser = async ({ id, userData }: { id: string; userData: Partial<UserFormData> }): Promise<AdminUser> => {
  const { data } = await axios.patch(`/tenant/admin-users/${id}`, userData);
  return data;
};

const deleteAdminUser = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/admin-users/${id}`);
};

// Hooks
export const useAdminUsers = () => {
  return useQuery({
    queryKey: adminUsersKeys.list(),
    queryFn: fetchAdminUsers,
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: adminUsersKeys.detail(id),
    queryFn: () => fetchAdminUser(id),
    enabled: !!id,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.detail(variables.id) });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
    },
  });
};
