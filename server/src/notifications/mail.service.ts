import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { Message } from '../messages/message.entity';
import { Tenant } from '../tenants/tenant.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;
  private fallbackTransporter?: nodemailer.Transporter;
  private readonly from: string;
  private readonly adminTo: string[];

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const host = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = Number(this.configService.get<string>('SMTP_PORT', '587'));
    const secure =
      this.configService.get<string>('SMTP_SECURE', `${port === 465}`) === 'true';
    const fallbackHost = this.configService.get<string>('SMTP_FALLBACK_HOST');
    const fallbackPort = Number(this.configService.get<string>('SMTP_FALLBACK_PORT', '465'));
    const fallbackSecure =
      this.configService.get<string>('SMTP_FALLBACK_SECURE', `${fallbackPort === 465}`) ===
      'true';
    const connectionTimeout = Number(
      this.configService.get<string>('SMTP_CONNECTION_TIMEOUT_MS', '15000'),
    );
    const socketTimeout = Number(
      this.configService.get<string>('SMTP_SOCKET_TIMEOUT_MS', `${connectionTimeout}`),
    );
    const supportTo =
      this.configService.get<string>('SUPPORT_TO') ||
      this.configService.get<string>('SMTP_TO');

    this.from =
      this.configService.get<string>('SMTP_FROM') || user || 'no-reply@example.com';
    const configuredRecipients = supportTo
      ?.split(/[,;]/)
      .map((email) => email.trim())
      .filter(Boolean);
    const fallbackRecipients = ['microsoft7779@gmail.com', 'info@arensafety.com'];

    this.adminTo = Array.from(
      new Set([...(configuredRecipients ?? []), ...(user ? [user] : []), ...fallbackRecipients]),
    );

    if (!user || !pass) {
      this.logger.warn(
        'SMTP_USER/SMTP_PASS are not configured. Support emails will likely fail until credentials are provided.',
      );
    }

    const sharedOptions = {
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout,
      greetingTimeout: connectionTimeout,
      socketTimeout,
      // Prefer IPv4 if IPv6 connectivity is blocked in the hosting environment
      family: 4,
    };

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      ...sharedOptions,
    });

    const shouldCreateFallback = fallbackHost || port !== 465 || !secure;
    if (shouldCreateFallback) {
      this.fallbackTransporter = nodemailer.createTransport({
        host: fallbackHost || host,
        port: fallbackPort,
        secure: fallbackSecure,
        ...sharedOptions,
      });
    }
  }

  async sendSupportNotification(message: Message) {
    if (!this.adminTo || this.adminTo.length === 0) {
      this.logger.warn('No admin recipient configured for support notifications');
      return;
    }

    const mailOptions = {
      from: this.from,
      to: this.adminTo,
      replyTo: message.tenantEmail || undefined,
      subject: `[Tenant Support] ${message.subject}`,
      text: [
        `Tenant ID: ${message.tenantId ?? 'Unknown'}`,
        `Tenant Email: ${message.tenantEmail ?? 'Unknown'}`,
        '',
        message.body,
      ].join('\n'),
    };

    await this.sendMail(mailOptions);
  }

  async sendTenantStatusChange(tenant: Tenant, status: string) {
    if (!tenant.email) return;
    const isActive = status === 'active';
    const subject = isActive
      ? 'Your tenant account is active'
      : `Your tenant status is now ${status}`;
    const body = isActive
      ? `Hello ${tenant.fullname},

Good news — your tenant account is now active. You can sign in and continue using the Aren Safety platform. If you need any assistance, please contact support.

Thank you,
Aren Safety Company`
      : `Hello ${tenant.fullname},

Your tenant account status has been set to "${status}" by the super admin because your free trial period has ended. If you would like to continue using the platform, please reply to this email or contact support so we can reactivate your access.

Thank you,
Aren Safety Company`;
    const mailOptions = {
      from: this.from,
      to: tenant.email,
      subject,
      text: body,
    };

    await this.sendMail(mailOptions);
  }

  async sendMobileAccountCredentials(payload: {
    to: string;
    fullName?: string;
    login: string;
    password: string;
    role?: string;
  }) {
    const { to, fullName, login, password, role } = payload;
    if (!to) {
      this.logger.warn('No recipient provided for mobile account credentials email');
      return;
    }

    const name = fullName || 'коллега';
    const roleRu = role === 'SUPERVISOR' ? 'Супервайзер' : 'Пользователь';
    const roleEn = role === 'SUPERVISOR' ? 'Supervisor' : 'User';
    const roleTr = role === 'SUPERVISOR' ? 'Süpervizör' : 'Kullanıcı';
    const subject = 'Доступ / Access to Aren Safety mobile';

    const ru = [
      `Здравствуйте, ${name}!`,
      '',
      'Для вас создана учетная запись в мобильном приложении Aren Safety.',
      '',
      `Роль: ${roleRu}`,
      `Логин: ${login}`,
      `Пароль: ${password}`,
      '',
      'Пожалуйста, сохраните эти данные для входа в систему.',
      '',
      'Желаем успешной работы!',
      '',
      'С уважением,',
      'Команда Aren Safety',
    ].join('\n');

    const en = [
      `Hello ${name},`,
      '',
      'Your account has been successfully created in the Aren Safety mobile application.',
      '',
      `Role: ${roleEn}`,
      `Login: ${login}`,
      `Password: ${password}`,
      '',
      'Please keep these credentials for logging in.',
      '',
      'Wishing you productive work!',
      '',
      'Best regards,',
      'Aren Safety Team',
    ].join('\n');

    const tr = [
      `Merhaba ${name},`,
      '',
      'Aren Safety mobil uygulaması için kullanıcı hesabınız oluşturulmuştur.',
      '',
      `Rolünüz: ${roleTr}`,
      `Kullanıcı adı: ${login}`,
      `Şifre: ${password}`,
      '',
      'Lütfen giriş bilgilerinizi saklayınız.',
      '',
      'İyi çalışmalar dileriz.',
      '',
      'Saygılarımızla,',
      'Aren Safety Ekibi',
    ].join('\n');

    await this.sendMail({
      from: this.from,
      to,
      subject,
      text: [ru, '', en, '', tr].join('\n'),
    });
  }

  async sendMobileAccountUpdate(payload: {
    to: string;
    fullName?: string;
    login: string;
    password?: string;
    loginChanged?: boolean;
    passwordChanged?: boolean;
  }) {
    const { to, fullName, login, password, loginChanged, passwordChanged } = payload;
    if (!to) {
      this.logger.warn('No recipient provided for mobile account update email');
      return;
    }

    const name = fullName || 'user';
    const subject = 'Your Aren Safety mobile account was updated';
    const lines = [
      `Hello ${name},`,
      '',
      'Your Aren Safety mobile account details have been updated.',
      loginChanged ? `New login: ${login}` : undefined,
      passwordChanged && password ? `New password: ${password}` : undefined,
      '',
      'If you did not request this change, please contact support immediately.',
      '',
      'Best regards,',
      'Aren Safety Team',
    ].filter(Boolean);

    await this.sendMail({
      from: this.from,
      to,
      subject,
      text: lines.join('\n'),
    });
  }

  private async sendMail(options: nodemailer.SendMailOptions) {
    const transports = [this.transporter, this.fallbackTransporter].filter(
      Boolean,
    ) as nodemailer.Transporter[];

    let lastError: Error | undefined;

    for (const [index, transport] of transports.entries()) {
      const label = index === 0 ? 'primary' : 'fallback';
      try {
        await transport.sendMail(options);
        if (label === 'fallback') {
          this.logger.warn('Primary SMTP transport failed; fallback transport succeeded.');
        }
        return;
      } catch (error) {
        lastError = error as Error;
        this.logger.error(`Failed to send email via ${label} transport`, lastError);
      }
    }

    if (lastError) {
      this.logger.error('All SMTP transports failed to send email', lastError);
    }
  }
}
