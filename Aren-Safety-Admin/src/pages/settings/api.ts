import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/shared/api/axios-instance';

export interface Settings {
  // General settings
  organizationName?: string;
  defaultLocale?: string;
  timezone?: string;

  // Branding settings
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  favicon?: string;

  // Notification settings
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  notificationTypes?: Record<string, boolean>;

  // Security settings
  passwordMinLength?: number;
  passwordRequireUppercase?: boolean;
  passwordRequireNumbers?: boolean;
  passwordRequireSymbols?: boolean;
  sessionTimeout?: number;
  twoFactorEnabled?: boolean;

  // Theme settings
  theme?: string;
  darkMode?: boolean;

  updatedAt?: string;
}

// Query Keys
export const settingsKeys = {
  all: ['settings'] as const,
  detail: () => [...settingsKeys.all, 'detail'] as const,
};

// API Functions
const fetchSettings = async (): Promise<Settings> => {
  const { data } = await axios.get('/tenant/settings');
  return data;
};

const updateSettings = async (settingsData: Partial<Settings>): Promise<Settings> => {
  const { data } = await axios.patch('/tenant/settings', settingsData);
  return data;
};

// Hooks
export const useSettings = () => {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: fetchSettings,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
};
