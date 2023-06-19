import { Body, Controller, Delete, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBadRequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiCustomResponse } from 'src/utils/decorator/api-custom.respone';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { Auth } from 'src/v1/auth/decorator/auths.decorator';
import { LoginDto } from 'src/v1/auth/dto/login.dto';
import { UserRole } from 'src/v1/user/enums/UserRole';
import { User } from 'src/v1/user/user.entity';
import { AuthService as AAuthService } from './auth.service';
import { LangDto } from 'src/utils/dto/lang.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

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
        errors: ['Username or password is incorrect'],
        message: 'Bad Request'
    })
    async login(@Query('lang') langDto: LangDto, @Body() loginDto: LoginDto, @I18n() i18n: I18nContext) {
        return this.authService.login(loginDto, i18n);
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
