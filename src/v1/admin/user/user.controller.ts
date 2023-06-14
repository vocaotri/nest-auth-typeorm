import { Controller, Delete, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGE_TEXT } from 'src/constants/message';
import { ApiBadRequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { ApiPaginatedResponse } from 'src/utils/decorator/api-pagination.response';
import { Auth } from 'src/v1/auth/decorator/auths.decorator';
import { UserRole } from 'src/v1/user/enums/UserRole';
import { User } from 'src/v1/user/user.entity';

@ApiTags('AUser')
@Controller()
export class UserController {
    @ApiModelResponse({
        model: User,
        message: 'Success. Returns user',
        status: HttpStatus.OK
    })
    @Get('me')
    @ApiOperation({ summary: 'Get current user' })
    @Auth(UserRole.ADMIN)
    async me() {
        return 'me';
    }

    @ApiPaginatedResponse({
        model: User,
        message: 'Success. Returns users',
        status: 200
    })
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @Auth(UserRole.ADMIN)
    async getAll() {
        return 'getAll';
    }

    @ApiModelResponse({
        model: User,
        message: 'Success. Returns user',
        status: HttpStatus.OK
    })
    @ApiBadRequestResponse({
        error: 'Bad Request',
        message: [
            MESSAGE_TEXT.USER_NOT_FOUND
        ]
    })
    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @Auth(UserRole.ADMIN)
    async getById(@Param('id') id: number) {
        return 'getById';
    }

    @ApiModelResponse({
        model: User,
        message: 'Success. Returns user',
        status: HttpStatus.ACCEPTED
    })
    @ApiBadRequestResponse({
        error: 'Bad Request',
        message: [
            MESSAGE_TEXT.USER_NOT_FOUND
        ]
    })
    @Patch(':id')
    @ApiOperation({ summary: 'Update user by id' })
    @Auth(UserRole.ADMIN)
    async update(@Param('id') id: number) {
        return 'update';
    }

    @ApiModelResponse({
        model: null,
        message: 'Success. Returns user',
        status: HttpStatus.OK
    })
    @ApiBadRequestResponse({
        error: 'Bad Request',
        message: [
            MESSAGE_TEXT.USER_NOT_FOUND
        ]
    })
    @Delete(':id')
    @ApiOperation({ summary: 'Remove user by id' })
    @Auth(UserRole.ADMIN)
    async RemoveUserById(@Param('id') id: number) {
        return 'RemoveUserById';
    }
}
