import { Controller, Delete, Get, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { Auth } from 'src/v1/auth/decorator/auths.decorator';
import { UserRole } from 'src/v1/user/enums/UserRole';
import { User } from 'src/v1/user/user.entity';

@Controller('user')
@ApiTags('AUser')
export class UserController {
    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.OK
    })
    @Get('me')
    @ApiOperation({ summary: 'Get current user' })
    @Auth(UserRole.ADMIN)
    async me() {
        return 'me';
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @Auth(UserRole.ADMIN)
    async getAll() {
        return 'getAll';
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @Auth(UserRole.ADMIN)
    async getById() {
        return 'getById';
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update user by id' })
    @Auth(UserRole.ADMIN)
    async update() {
        return 'update';
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove user by id' })
    @Auth(UserRole.ADMIN)
    async RemoveUserById() {
        return 'RemoveUserById';
    }
}
