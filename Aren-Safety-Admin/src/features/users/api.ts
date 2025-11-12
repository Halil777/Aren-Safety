import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';

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

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleDistribution: Record<string, number>;
  departmentDistribution: Record<string, number>;
  recentlyActive: number;
}

interface UserFilters {
  role?: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  isActive?: boolean;
  search?: string;
}

// Query Keys
export const usersKeys = {
  all: ['users'] as const,
  list: (filters?: UserFilters) => [...usersKeys.all, 'list', filters] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
  stats: () => [...usersKeys.all, 'stats'] as const,
};

// API Functions
const fetchUsers = async (filters?: UserFilters): Promise<User[]> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.role) params.append('role', filters.role);
    if (filters.department) params.append('department', filters.department);
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters.search) params.append('search', filters.search);
  }
  const { data } = await axios.get(`/tenant/users?${params.toString()}`);
  return data;
};

const fetchUser = async (id: string): Promise<User> => {
  const { data } = await axios.get(`/tenant/users/${id}`);
  return data;
};

const fetchUserStats = async (): Promise<UserStats> => {
  const { data } = await axios.get('/tenant/users/stats');
  return data;
};

interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  position?: string;
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
}

const createUser = async (userData: CreateUserPayload): Promise<User> => {
  const { data } = await axios.post('/tenant/users', userData);
  return data;
};

interface UpdateUserPayload {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  position?: string;
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
}

const updateUser = async ({ id, userData }: { id: string; userData: UpdateUserPayload }): Promise<User> => {
  const { data } = await axios.patch(`/tenant/users/${id}`, userData);
  return data;
};

const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/users/${id}`);
};

// Hooks
export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => fetchUsers(filters),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: usersKeys.stats(),
    queryFn: fetchUserStats,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.all });
      const previousUsers = queryClient.getQueriesData({ queryKey: usersKeys.all });

      // Optimistic update
      queryClient.setQueriesData({ queryKey: usersKeys.all }, (old: User[] | undefined) => {
        if (!old) return old;
        const tempUser: User = {
          id: 'temp-' + Date.now(),
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          role: newUser.role,
          department: newUser.department,
          position: newUser.position,
          avatar: newUser.avatar,
          isActive: newUser.isActive ?? true,
          lastLogin: newUser.lastLogin,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [...old, tempUser];
      });

      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async ({ id, userData }) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.all });
      await queryClient.cancelQueries({ queryKey: usersKeys.detail(id) });

      const previousUsers = queryClient.getQueriesData({ queryKey: usersKeys.all });
      const previousUser = queryClient.getQueryData(usersKeys.detail(id));

      queryClient.setQueriesData({ queryKey: usersKeys.all }, (old: User[] | undefined) => {
        if (!old) return old;
        return old.map((user) => user.id === id ? { ...user, ...userData, updatedAt: new Date().toISOString() } : user);
      });

      queryClient.setQueryData(usersKeys.detail(id), (old: User | undefined) => {
        if (!old) return old;
        return { ...old, ...userData, updatedAt: new Date().toISOString() };
      });

      return { previousUsers, previousUser, id };
    },
    onError: (err, variables, context) => {
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousUser) {
        queryClient.setQueryData(usersKeys.detail(context.id), context.previousUser);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.all });
      const previousUsers = queryClient.getQueriesData({ queryKey: usersKeys.all });

      queryClient.setQueriesData({ queryKey: usersKeys.all }, (old: User[] | undefined) => {
        if (!old) return old;
        return old.filter((user) => user.id !== id);
      });

      return { previousUsers };
    },
    onError: (err, id, context) => {
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
    },
  });
};
