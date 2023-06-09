import { Body, Controller, Delete, HttpStatus, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBadRequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiCustomResponse } from 'src/utils/decorator/api-custom.respone';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { UserRole } from '../user/enums/UserRole';
import { User } from '../user/user.entity';
import { Auth } from './decorator/auths.decorator';
import { LoginDto } from './dto/login.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiCustomResponse({
        status: HttpStatus.OK,
        message: 'Success. Returns access token',
        dataCustom: {
            key: 'tokens',
            value: {
                access_token: { type: 'string', example: "jwt_token" },
                expiration_date: { type: 'string', example: "2021-08-01T08:00:00.000Z" },
                refresh_token: { type: 'string', example: "refresh_token", },
                refresh_expiration_date: { type: 'string', example: "2021-08-01T08:00:00.000Z" }
            }
        },
        model: User
    })
    @ApiBadRequestResponse({
        error: 'Bad Request',
        message: ['Username or password is incorrect']
    })
    async login(@Body() loginDto: LoginDto) {
        return 'login';
    }

    @ApiModelResponse({
        model: User,
        message: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @ApiBadRequestResponse({
        error: 'Bad Request',
        message: ['Phone number is already in use']
    })
    @Post('register')
    @ApiOperation({ summary: 'Register' })
    async register() {
        return 'register';
    }

    @ApiModelResponse({
        model: null,
        message: 'Success. Returns user',
        status: HttpStatus.ACCEPTED
    })
    @Delete('logout')
    @ApiOperation({ summary: 'Logout' })
    @Auth(UserRole.USER)
    async logout() {
        return 'logout';
    }
}