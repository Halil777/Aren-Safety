import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';

// Types
export interface UserRole {
  id: string;
  name_en: string;
  name_ru: string;
  name_tr: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRoleInput {
  name_en: string;
  name_ru: string;
  name_tr: string;
}

export interface UpdateUserRoleInput {
  name_en?: string;
  name_ru?: string;
  name_tr?: string;
}

// API functions
const fetchUserRoles = async (): Promise<UserRole[]> => {
  const { data } = await axios.get('/tenant/user-roles');
  return data;
};

const fetchUserRole = async (id: string): Promise<UserRole> => {
  const { data } = await axios.get(`/tenant/user-roles/${id}`);
  return data;
};

const createUserRole = async (input: CreateUserRoleInput): Promise<UserRole> => {
  const { data } = await axios.post('/tenant/user-roles', input);
  return data;
};

const updateUserRole = async ({ id, ...input }: UpdateUserRoleInput & { id: string }): Promise<UserRole> => {
  const { data } = await axios.patch(`/tenant/user-roles/${id}`, input);
  return data;
};

const deleteUserRole = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/user-roles/${id}`);
};

// React Query hooks
export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: fetchUserRoles,
  });
};

export const useUserRole = (id: string) => {
  return useQuery({
    queryKey: ['user-roles', id],
    queryFn: () => fetchUserRole(id),
    enabled: !!id,
  });
};

export const useCreateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
};
