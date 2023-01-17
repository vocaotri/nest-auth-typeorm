import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/v1/user/enums/UserRole';

export const AuthRoles = (...roles: UserRole[]) => {
  return SetMetadata('roles', roles);
};