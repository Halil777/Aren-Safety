import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TenantContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    if (!tenantId) {
      throw new BadRequestException('X-Tenant-Id header is required');
    }
    req.tenantId = tenantId;
    return true;
  }
}

