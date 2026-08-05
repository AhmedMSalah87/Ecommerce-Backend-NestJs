import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(), //to access roles on methods
      context.getClass(), //to access roles on controller
    ]);
    console.log(roles);
    if (!roles) {
      return true; // if i have route has no specified role so allow access
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    return roles.includes(user.role);
  }
}
