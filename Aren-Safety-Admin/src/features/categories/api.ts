import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';
import type { Category, CategoryFilterParams } from './types';

// Query Keys
export const categoriesKeys = {
  all: ['categories'] as const,
  list: (filters?: CategoryFilterParams) => [...categoriesKeys.all, 'list', filters] as const,
  detail: (id: string) => [...categoriesKeys.all, 'detail', id] as const,
};

// API Functions
const fetchCategories = async (filters?: CategoryFilterParams): Promise<Category[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const { data } = await axios.get(`/tenant/categories?${params.toString()}`);
  return data;
};

const fetchCategory = async (id: string): Promise<Category> => {
  const { data } = await axios.get(`/tenant/categories/${id}`);
  return data;
};

const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  const { data } = await axios.post('/tenant/categories', categoryData);
  return data;
};

const updateCategory = async ({ id, categoryData }: { id: string; categoryData: Partial<Category> }): Promise<Category> => {
  const { data } = await axios.patch(`/tenant/categories/${id}`, categoryData);
  return data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/categories/${id}`);
};

// Hooks
export const useCategories = (filters?: CategoryFilterParams) => {
  return useQuery({
    queryKey: categoriesKeys.list(filters),
    queryFn: () => fetchCategories(filters),
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.detail(variables.id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
};
