import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';
import type { Observation, ObservationFilterParams, SupervisorResponse } from './types';

// Query Keys
export const observationsKeys = {
  all: ['observations'] as const,
  list: (filters?: ObservationFilterParams) => [...observationsKeys.all, 'list', filters] as const,
  detail: (id: string) => [...observationsKeys.all, 'detail', id] as const,
};

// API Functions
const fetchObservations = async (filters?: ObservationFilterParams): Promise<Observation[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const { data } = await axios.get(`/tenant/observations?${params.toString()}`);
  return data;
};

const fetchObservation = async (id: string): Promise<Observation> => {
  const { data } = await axios.get(`/tenant/observations/${id}`);
  return data;
};

const createObservation = async (observationData: Omit<Observation, 'id' | 'key'>): Promise<Observation> => {
  const { data } = await axios.post('/tenant/observations', observationData);
  return data;
};

const updateObservation = async ({ id, observationData }: { id: string; observationData: Partial<Observation> }): Promise<Observation> => {
  const { data } = await axios.patch(`/tenant/observations/${id}`, observationData);
  return data;
};

const deleteObservation = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/observations/${id}`);
};

const addSupervisorResponse = async ({ id, responseData }: { id: string; responseData: Omit<SupervisorResponse, 'respondedAt'> }): Promise<Observation> => {
  const { data } = await axios.post(`/tenant/observations/${id}/supervisor-response`, responseData);
  return data;
};

// Hooks
export const useObservations = (filters?: ObservationFilterParams) => {
  return useQuery({
    queryKey: observationsKeys.list(filters),
    queryFn: () => fetchObservations(filters),
  });
};

export const useObservation = (id: string) => {
  return useQuery({
    queryKey: observationsKeys.detail(id),
    queryFn: () => fetchObservation(id),
    enabled: !!id,
  });
};

export const useCreateObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createObservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: observationsKeys.all });
    },
  });
};

export const useUpdateObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateObservation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: observationsKeys.all });
      queryClient.invalidateQueries({ queryKey: observationsKeys.detail(variables.id) });
    },
  });
};

export const useDeleteObservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteObservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: observationsKeys.all });
    },
  });
};

export const useAddSupervisorResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSupervisorResponse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: observationsKeys.all });
      queryClient.invalidateQueries({ queryKey: observationsKeys.detail(variables.id) });
    },
  });
};
