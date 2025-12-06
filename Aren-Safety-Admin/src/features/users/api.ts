import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  position?: string;
  isActive?: boolean;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  position?: string;
  isActive?: boolean;
}

// API functions
const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get('/tenant/users');
  return data;
};

const fetchUser = async (id: string): Promise<User> => {
  const { data } = await axios.get(`/tenant/users/${id}`);
  return data;
};

const createUser = async (input: CreateUserInput): Promise<User> => {
  const { data } = await axios.post('/tenant/users', input);
  return data;
};

const updateUser = async ({ id, ...input }: UpdateUserInput & { id: string }): Promise<User> => {
  const { data } = await axios.patch(`/tenant/users/${id}`, input);
  return data;
};

const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/users/${id}`);
};

// React Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
