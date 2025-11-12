export class UpdateSettingsDto {
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
}
