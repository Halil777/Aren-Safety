import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';
import type { Branch, BranchFilterParams } from './types';

// Query Keys
export const branchesKeys = {
  all: ['branches'] as const,
  list: (filters?: BranchFilterParams) => [...branchesKeys.all, 'list', filters] as const,
  detail: (id: string) => [...branchesKeys.all, 'detail', id] as const,
};

// API Functions
const fetchBranches = async (filters?: BranchFilterParams): Promise<Branch[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const { data } = await axios.get(`/tenant/branches?${params.toString()}`);
  return data;
};

const fetchBranch = async (id: string): Promise<Branch> => {
  const { data } = await axios.get(`/tenant/branches/${id}`);
  return data;
};

const createBranch = async (branchData: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch> => {
  const { data } = await axios.post('/tenant/branches', branchData);
  return data;
};

const updateBranch = async ({ id, branchData }: { id: string; branchData: Partial<Branch> }): Promise<Branch> => {
  const { data } = await axios.patch(`/tenant/branches/${id}`, branchData);
  return data;
};

const deleteBranch = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/branches/${id}`);
};

// Hooks
export const useBranches = (filters?: BranchFilterParams) => {
  return useQuery({
    queryKey: branchesKeys.list(filters),
    queryFn: () => fetchBranches(filters),
  });
};

export const useBranch = (id: string) => {
  return useQuery({
    queryKey: branchesKeys.detail(id),
    queryFn: () => fetchBranch(id),
    enabled: !!id,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBranch,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
      queryClient.invalidateQueries({ queryKey: branchesKeys.detail(variables.id) });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
};
