import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';
import type { Supervisor, CreateSupervisorDto, UpdateSupervisorDto } from '@/shared/types/supervisor';

// Query Keys
export const supervisorsKeys = {
  all: ['supervisors'] as const,
  list: (filters?: { projectId?: string; department?: string; search?: string }) => [...supervisorsKeys.all, 'list', filters] as const,
  detail: (id: string) => [...supervisorsKeys.all, 'detail', id] as const,
};

// API Functions
const fetchSupervisors = async (filters?: { projectId?: string; department?: string; search?: string }): Promise<Supervisor[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const { data } = await axios.get(`/tenant/supervisors?${params.toString()}`);
  return data;
};

const fetchSupervisor = async (id: string): Promise<Supervisor> => {
  const { data } = await axios.get(`/tenant/supervisors/${id}`);
  return data;
};

const createSupervisor = async (supervisorData: CreateSupervisorDto): Promise<Supervisor> => {
  const { data } = await axios.post('/tenant/supervisors', supervisorData);
  return data;
};

const updateSupervisor = async ({ id, supervisorData }: { id: string; supervisorData: UpdateSupervisorDto }): Promise<Supervisor> => {
  const { data } = await axios.patch(`/tenant/supervisors/${id}`, supervisorData);
  return data;
};

const deleteSupervisor = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/supervisors/${id}`);
};

// Hooks
export const useSupervisors = (filters?: { projectId?: string; department?: string; search?: string }) => {
  return useQuery({
    queryKey: supervisorsKeys.list(filters),
    queryFn: () => fetchSupervisors(filters),
  });
};

export const useSupervisor = (id: string) => {
  return useQuery({
    queryKey: supervisorsKeys.detail(id),
    queryFn: () => fetchSupervisor(id),
    enabled: !!id,
  });
};

export const useCreateSupervisor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupervisor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supervisorsKeys.all });
    },
  });
};

export const useUpdateSupervisor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupervisor,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supervisorsKeys.all });
      queryClient.invalidateQueries({ queryKey: supervisorsKeys.detail(variables.id) });
    },
  });
};

export const useDeleteSupervisor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupervisor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supervisorsKeys.all });
    },
  });
};
