/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common/decorators';
import { Roles } from '../guards/role.enum';

export const Role = (...roles: Roles[]) => SetMetadata('roles', roles);
