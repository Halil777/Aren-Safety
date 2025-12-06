import { useQuery } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';

export interface ProjectCodeRecord {
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
}

// Query Keys
export const projectCodesKeys = {
  all: ['project-codes'] as const,
  list: () => [...projectCodesKeys.all, 'list'] as const,
};

// API Functions
const fetchProjectCodes = async (): Promise<ProjectCodeRecord[]> => {
  const { data } = await axios.get('/tenant/project-codes');
  return data;
};

// Hooks
export const useProjectCodesAPI = () => {
  return useQuery({
    queryKey: projectCodesKeys.list(),
    queryFn: fetchProjectCodes,
  });
};
