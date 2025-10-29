
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRole } from 'src/global';
import { Roles, ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {


        const requiredRoles = this.reflector.get(ROLES_KEY, context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            return true; 
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user

        if(user.role === 'user' && requiredRoles.includes('user')){
            const userId = user.id
            const resourceId = request.params.id
            return userId == resourceId

        }

        if (requiredRoles.includes(user.role)){
            return true
        }
        else{
             throw new ForbiddenException(' you not allowed to perform this action')
        }
    }
}
