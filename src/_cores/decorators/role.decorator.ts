
import { SetMetadata } from '@nestjs/common';
import { IRole } from 'src/global';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: IRole[]) => SetMetadata(ROLES_KEY, roles);
