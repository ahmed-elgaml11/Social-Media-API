
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserPaylod } from 'src/global';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1]
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const decoded = await this.jwtService.verifyAsync(token) as IUserPaylod
      const user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      } as IUserPaylod

      request.user = user

    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true
  }
}
