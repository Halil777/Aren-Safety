import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { TenantContextGuard } from './tenant.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';

type SettingsRecord = {
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

  updatedAt: string;
};

@UseGuards(TenantContextGuard)
@Controller('tenant/settings')
export class SettingsController {
  constructor(private readonly storage: StorageService) {}

  private read(tenantId: string): SettingsRecord {
    const settings = this.storage.readCollection<SettingsRecord>(tenantId, 'settings');
    // Return first settings object or default
    return settings[0] || {
      organizationName: '',
      defaultLocale: 'en',
      timezone: 'UTC',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false,
      sessionTimeout: 3600,
      twoFactorEnabled: false,
      theme: 'light',
      darkMode: false,
      updatedAt: new Date().toISOString(),
    };
  }

  private write(tenantId: string, doc: SettingsRecord) {
    return this.storage.writeCollection<SettingsRecord>(tenantId, 'settings', [doc]);
  }

  @Get()
  get(@Req() req: any) {
    return this.read(req.tenantId);
  }

  @Patch()
  update(@Req() req: any, @Body() dto: UpdateSettingsDto) {
    const current = this.read(req.tenantId);
    const updated: SettingsRecord = {
      ...current,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.write(req.tenantId, updated);
    return updated;
  }
}
