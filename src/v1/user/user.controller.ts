import { Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMINACCESSTOKEN, USERACCESSTOKEN } from 'src/contants/token-name';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { ApiPaginatedResponse } from 'src/utils/decorator/api-pagination.response';
import { Auths } from '../auth/decorator/auths.decorator';
import { UserRolePublic } from './enums/UserRole';
import { User } from './user.entity';

@Controller()
@ApiTags('user')
export class UserController {
    /* Creating a route that returns the current user. */
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

    
    /* The above code is using the `@ApiModelResponse` decorator to add a response model to the
    `update` method. */
    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @Patch('user/:id')
    @ApiOperation({ summary: 'Update user (Admin)' })
    @Auths([UserRolePublic.ADMIN], [ADMINACCESSTOKEN])
    /**
     * The `@Param('id')` decorator is used to get the value of the `id` parameter from the URL
     * @param {number} id - The id of the user to update.
     * @returns The string 'update'
     */
    async update(@Param('id') id: number) {
        return 'update';
    }

    
    /* Creating a route that will return all users. */
    @ApiPaginatedResponse({
        model: User,
        description: 'Success. Returns users',
        status: HttpStatus.OK
    })
    @Get('users')
    @ApiOperation({ summary: 'Get all users (Admin)' })
    @Auths([UserRolePublic.ADMIN], [ADMINACCESSTOKEN])
    /**
     * The function returns a promise that resolves to a string
     * @returns 'getAll'
     */
    async getAll() {
        return 'getAll';
    }
}
