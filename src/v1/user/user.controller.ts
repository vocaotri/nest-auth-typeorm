import { Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { Auth } from '../auth/decorator/auths.decorator';
import { UserRole } from './enums/UserRole';
import { User } from './user.entity';
import { ApiBadRequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller()
@ApiTags('User')
export class UserController {
    @ApiModelResponse({
        model: User,
        message: 'Success. Returns user',
        status: HttpStatus.OK
    })
    @ApiOperation({ summary: 'Get current user' })
    @Get('me')
    @Auth(UserRole.USER)
    async me(@GetUser() user: User) {
        return user;
    }

    @ApiModelResponse({
        model: User,
        message: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @ApiBadRequestResponse({
        error: 'Bad Request',
        message: [
            'Phone number is already in use',
            'User not found'
        ]
    })
    @ApiOperation({ summary: 'Update user' })
    @Patch('user')
    @Auth(UserRole.USER)
    async update(@Param('id') id: number) {
        return 'update';
    }
}
