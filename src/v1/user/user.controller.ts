import { Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMINACCESSTOKEN, USERACCESSTOKEN } from 'src/contants/token-name';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { ApiPaginatedResponse } from 'src/utils/decorator/api-pagination.response';
import { Auths } from '../auth/decorator/auths.decorator';
import { UserRolePublic } from './enums/UserRole';
import { User } from './user.entity';

@Controller()
@ApiTags('user')
export class UserController {
    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.OK
    })
    @Get('me')
    @ApiOperation({ summary: 'Get current user (User-Admin)' })
    @Auths([UserRolePublic.USER, UserRolePublic.ADMIN], [USERACCESSTOKEN, ADMINACCESSTOKEN])
    async me() {
        return 'me';
    }

    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @Patch('user/:id')
    @ApiOperation({ summary: 'Update user (Admin)' })
    @Auths([UserRolePublic.ADMIN], [ADMINACCESSTOKEN])
    async update(@Param('id') id: number) {
        return 'update';
    }

    @ApiPaginatedResponse({
        model: User,
        description: 'Success. Returns users',
        status: HttpStatus.OK
    })
    @Get('users')
    @ApiOperation({ summary: 'Get all users (Admin)' })
    @Auths([UserRolePublic.ADMIN], [ADMINACCESSTOKEN])
    async getAll() {
        return 'getAll';
    }
}
