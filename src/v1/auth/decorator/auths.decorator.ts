import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ADMIN_ACCESS_TOKEN, USER_ACCESS_TOKEN } from 'src/contants/token-name';
import { UserRole } from 'src/v1/user/enums/UserRole';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/role.guard';
import { AuthRoles } from './auth.decorator';

export function Auth(role?: UserRole | UserRole[], token_types?: string | string[]) {
    let roles = [];
    if (typeof role === 'string') roles = [role];
    else roles = role;
    let decorators = [
        AuthRoles(...roles),
        UseGuards(JwtAuthGuard, RolesGuard),
    ];
    switch (role) {
        case UserRole.USER:
            decorators.push(
                ApiBearerAuth(USER_ACCESS_TOKEN),
                ApiUnauthorizedResponse({ description: 'Unauthorized' }),
            );
            break;
        default:
            decorators.push(
                ApiBearerAuth(ADMIN_ACCESS_TOKEN),
                ApiUnauthorizedResponse({ description: 'Unauthorized' }),
            );
    }
    return applyDecorators(
        ...decorators,
    );
}
