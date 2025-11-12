import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SUPERADMIN_TOKEN } from './constants';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = auth.slice('Bearer '.length);
    if (token !== SUPERADMIN_TOKEN) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}

