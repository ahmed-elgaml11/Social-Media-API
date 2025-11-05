
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { ResourceService } from 'src/resource/resource.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private resourceService: ResourceService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request.user
        const resourceType = this.extractResource(request.path)
        const resourceId = request.params.id
        if (!resourceType) {
            throw new BadRequestException('resource not found')
        }

        const requiredRoles = this.reflector.get(ROLES_KEY, context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }


        if (user.role === 'user' && requiredRoles.includes('user')) {
            const userId = user.id
            const resourceIdOfUser = await this.resourceService.getResource(resourceType, resourceId)
            if (!resourceIdOfUser) {
                throw new BadRequestException('resource of this user not found')
            }
            return userId == resourceIdOfUser

        }

        if (requiredRoles.includes(user.role)) {
            return true
        }
        else {
            throw new ForbiddenException(' you not allowed to perform this action')
        }
    }

    private extractResource(path: string): string | null {
        const exactPath = path.split('/')
        if (exactPath.length > 3) {
            return exactPath[3]
        }
        return null
    }
}
