/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.getAllAndOverride('is-public', 
      [
        context.getHandler(),
        context.getClass(),
      ]
    );
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<Request & { user: { role: 'ADMIN' | 'USER' } }>();
    const user = request.user;
    if (!request.user) {
      throw new ForbiddenException('User not authenticated');
    }
    return user.role === 'ADMIN';
  }
}
