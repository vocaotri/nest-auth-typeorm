import { Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { Auth } from '../auth/decorator/auths.decorator';
import { UserRole } from './enums/UserRole';
import { User } from './user.entity';

@Controller()
@ApiTags('User')
export class UserController {
    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.OK
    })
    @ApiOperation({ summary: 'Get current user' })
    @Get('me')
    @Auth(UserRole.USER)
    async me() {
        return 'me';
    }

    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @ApiOperation({ summary: 'Update user' })
    @Patch('user')
    @Auth(UserRole.USER)
    async update(@Param('id') id: number) {
        return 'update';
    }
}
