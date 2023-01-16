import { Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { ApiPaginatedResponse } from 'src/utils/decorator/api-pagination.response';
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
    @ApiBearerAuth('user_access_token')
    @ApiBearerAuth('admin_access_token')
    async me() {
        return 'me';
    }

    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @ApiBearerAuth('admin_access_token')
    @Patch('user/:id')
    @ApiOperation({ summary: 'Update user (Admin)' })
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
    @ApiBearerAuth('admin_access_token')
    async getAll() {
        return 'getAll';
    }
}
