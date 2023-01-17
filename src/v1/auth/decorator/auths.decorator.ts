import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRolePublic } from 'src/v1/user/enums/UserRole';
import { RolesGuard } from '../guard/role.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AuthRoles } from './auth.decorator';

export function Auths(role?: UserRolePublic | UserRolePublic[]) {
    let roles = [];
    if (typeof role === 'string') roles = [role];
    else roles = role;
    return applyDecorators(
        AuthRoles(...roles),
        UseGuards(JwtAuthGuard, RolesGuard),
        // ApiBearerAuth('accessToken'),
        // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
