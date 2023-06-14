import { Body, Controller, Delete, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBadRequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiCustomResponse } from 'src/utils/decorator/api-custom.respone';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { Auth } from 'src/v1/auth/decorator/auths.decorator';
import { LoginDto } from 'src/v1/auth/dto/login.dto';
import { UserRole } from 'src/v1/user/enums/UserRole';
import { User } from 'src/v1/user/user.entity';
import { AuthService as AAuthService } from './auth.service';

@Controller()
@ApiTags('AAuth')
export class AuthController {
    constructor(
        private readonly authService: AAuthService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Admin Login' })
    @ApiCustomResponse({
        status: HttpStatus.OK,
        message: 'Success. Returns access token',
        dataCustom: {
            key: 'token',
            value: {
                accessToken: { type: 'string', example: "jwt_token" },
                expirationDate: { type: 'string', example: "2021-08-01T08:00:00.000Z" },
                refreshToken: { type: 'string', example: "refreshToken", },
                refreshExpirationDate: { type: 'string', example: "2021-08-01T08:00:00.000Z" }
            }
        },
        model: User
    })
    @ApiBadRequestResponse({
        error: 'Bad Request',
        message: ['Username or password is incorrect']
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiModelResponse({
        model: null,
        message: 'Success. Returns user',
        status: HttpStatus.ACCEPTED
    })
    @Delete('logout')
    @ApiOperation({ summary: 'Logout' })
    @Auth(UserRole.ADMIN)
    async logout() {
        return 'logout';
    }
}
