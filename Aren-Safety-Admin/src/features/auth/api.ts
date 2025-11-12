import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/shared/api/axios-instance';
import { useAuthStore } from '@/shared/stores/auth-store';

type LoginPayload = { login: string; password: string };

type LoginResponse = {
  token: string;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
    tenants: any[];
    createdAt: string;
    updatedAt: string;
  };
};

export function useLoginMutation() {
  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post<LoginResponse>('/auth/login', payload);
      return data;
    },
    onSuccess: (data) => {
      const { user, token, refreshToken } = data;
      useAuthStore.getState().login(user as any, token, refreshToken ?? undefined);
    },
  });
}
