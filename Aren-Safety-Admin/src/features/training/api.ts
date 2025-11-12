import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';
import type { TrainingSession, TrainingFiltersType } from './types';

// Query Keys
export const trainingKeys = {
  all: ['training'] as const,
  list: (filters?: TrainingFiltersType) => [...trainingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...trainingKeys.all, 'detail', id] as const,
};

// API Functions
const fetchTrainingSessions = async (filters?: TrainingFiltersType): Promise<TrainingSession[]> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.department) params.append('department', filters.department);
    if (filters.mandatory !== undefined) params.append('mandatory', String(filters.mandatory));
  }
  const { data } = await axios.get(`/tenant/training?${params.toString()}`);
  return data;
};

const fetchTrainingSession = async (id: string): Promise<TrainingSession> => {
  const { data } = await axios.get(`/tenant/training/${id}`);
  return data;
};

const createTrainingSession = async (trainingData: Omit<TrainingSession, 'id'>): Promise<TrainingSession> => {
  const { data } = await axios.post('/tenant/training', trainingData);
  return data;
};

const updateTrainingSession = async ({ id, trainingData }: { id: string; trainingData: Partial<TrainingSession> }): Promise<TrainingSession> => {
  const { data } = await axios.patch(`/tenant/training/${id}`, trainingData);
  return data;
};

const deleteTrainingSession = async (id: string): Promise<void> => {
  await axios.delete(`/tenant/training/${id}`);
};

// Hooks
export const useTrainingSessions = (filters?: TrainingFiltersType) => {
  return useQuery({
    queryKey: trainingKeys.list(filters),
    queryFn: () => fetchTrainingSessions(filters),
  });
};

export const useTrainingSession = (id: string) => {
  return useQuery({
    queryKey: trainingKeys.detail(id),
    queryFn: () => fetchTrainingSession(id),
    enabled: !!id,
  });
};

export const useCreateTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrainingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.all });
    },
  });
};

export const useUpdateTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrainingSession,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.all });
      queryClient.invalidateQueries({ queryKey: trainingKeys.detail(variables.id) });
    },
  });
};

export const useDeleteTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrainingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.all });
    },
  });
};
