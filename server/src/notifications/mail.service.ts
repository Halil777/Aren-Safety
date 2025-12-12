import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { Message } from '../messages/message.entity';
import { Tenant } from '../tenants/tenant.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;
  private readonly from: string;
  private readonly adminTo: string;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const host = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    this.from =
      this.configService.get<string>('SMTP_FROM') || user || 'no-reply@example.com';
    this.adminTo =
      this.configService.get<string>('SUPPORT_TO') ||
      this.configService.get<string>('SMTP_TO') ||
      user ||
      'microsoft7779@gmail.com';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendSupportNotification(message: Message) {
    if (!this.adminTo) {
      this.logger.warn('No admin recipient configured for support notifications');
      return;
    }

    const mailOptions = {
      from: this.from,
      to: this.adminTo,
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

  private async sendMail(options: nodemailer.SendMailOptions) {
    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      this.logger.error('Failed to send email', error as Error);
    }
  }
}
