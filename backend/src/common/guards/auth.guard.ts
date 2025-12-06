import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    // Extract token from "Bearer {token}"
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // For development: Set a default user with admin role
    // In production, you would validate the token and extract user info from JWT
    request.user = {
      id: token.includes('superadmin') ? 'superadmin' : token.replace('tenant-token-', ''),
      role: 'admin', // Default to admin role for development
    };

    return true;
  }
}
