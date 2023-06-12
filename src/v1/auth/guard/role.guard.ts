import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        let roles: any = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        if (typeof roles[0] === 'object') roles = roles[0];
        const request = context.switchToHttp().getRequest<Request>();
        const userRequest: any = request.user;
        const isAuthorized = roles.includes(userRequest.role);
        if (!isAuthorized) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return true;
    }
}
