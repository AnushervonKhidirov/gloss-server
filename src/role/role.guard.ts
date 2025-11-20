import type { Request } from 'express';
import type { UserTokenPayload } from 'src/token/type/token.type';

import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { Roles } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles || !roles.length) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as UserTokenPayload;

    if (!user || !user.role) throw new UnauthorizedException();
    if (!roles.includes(user.role)) throw new ForbiddenException();

    return true;
  }
}
