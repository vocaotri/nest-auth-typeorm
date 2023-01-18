import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRolePublic } from 'src/v1/user/enums/UserRole';
import { RolesGuard } from '../guard/role.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AuthRoles } from './auth.decorator';

export function Auths(role?: UserRolePublic | UserRolePublic[], token_types?: string[]) {
    let roles = [];
    if (typeof role === 'string') roles = [role];
    else roles = role;
    let decarators = [
        AuthRoles(...roles),
        UseGuards(JwtAuthGuard, RolesGuard),
    ];
    token_types.forEach(token_type => {
        decarators.push(
            ApiBearerAuth(token_type),
            ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        );
    });
    return applyDecorators(
        ...decarators,
    );
}
