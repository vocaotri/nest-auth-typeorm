import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { MESSAGE_TEXT } from 'src/constants/message';
import { ApiBadRequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiCustomResponse } from 'src/utils/decorator/api-custom.respone';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { LangDto } from 'src/utils/dto/lang.dto';
import { UserRole } from '../user/enums/UserRole';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auths.decorator';
import { GetUser } from './decorator/get-user.decorator';
import { ForgetPassDto } from './dto/forget-pass.dto';
import { LoginDto } from './dto/login.dto';
import { NewPassDto } from './dto/new-pass.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPassDto } from './dto/reset-pass.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiCustomResponse({
        status: HttpStatus.OK,
        message: 'Success. Returns access token',
        dataCustom: {
            key: 'tokens',
            value: {
                accessToken: { type: 'string', example: "jwtToken" },
                expirationDate: { type: 'string', example: "2021-08-01T08:00:00.000Z" },
                refreshToken: { type: 'string', example: "refreshToken", },
                refreshExpirationDate: { type: 'string', example: "2021-08-01T08:00:00.000Z" }
            }
        },
        model: User
    })
    @ApiBadRequestResponse({
        errors: [
            MESSAGE_TEXT.LOGIN_FAIL,
        ],
        message: 'Bad Request'
    })
    async login(@Query('lang') langDto: LangDto, @Body() loginDto: LoginDto, @I18n() i18n: I18nContext) {
        return this.authService.login(loginDto, i18n);
    }

    @ApiModelResponse({
        model: User,
        message: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @ApiBadRequestResponse({
        errors: [MESSAGE_TEXT.PHONE_EXIST],
        message: 'Bad Request'
    })
    @Post('register')
    @ApiOperation({ summary: 'Register' })
    async register(@Query('lang') langDto: LangDto, @Body() registerDto: RegisterDto) {
        return this.userService.createUser(registerDto);
    }

    @ApiModelResponse({
        model: null,
        message: 'Success. Returns send mail forget password',
        status: HttpStatus.CREATED
    })
    @ApiBadRequestResponse({
        errors: [MESSAGE_TEXT.EMAIL_NOT_EXIST],
        message: 'Bad Request'
    })
    @Post('forget-password')
    @ApiOperation({ summary: 'Forgot password' })
    async forgetPassword(@Query('lang') langDto: LangDto, @Body() forgetPasswordDto: ForgetPassDto, @I18n() i18n: I18nContext) {
        return this.authService.forgetPassword(forgetPasswordDto, i18n);
    }

    @ApiModelResponse({
        model: null,
        message: 'Logout success',
        status: HttpStatus.ACCEPTED
    })
    @Delete('logout')
    @ApiOperation({ summary: 'Logout' })
    @Auth(UserRole.USER)
    @HttpCode(HttpStatus.ACCEPTED)
    async logout(@Query('lang') langDto: LangDto, @GetUser() user: User) {
        return this.authService.logout(user);
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'Refresh token' })
    @ApiCustomResponse({
        status: HttpStatus.OK,
        message: 'Success. Returns access token',
        dataCustom: {
            key: 'token',
            value: {
                accessToken: { type: 'string', example: "jwtToken" },
                expirationDate: { type: 'string', example: "2021-08-01T08:00:00.000Z" },
                refreshToken: { type: 'string', example: "refreshToken", },
                refreshExpirationDate: { type: 'string', example: "2021-08-01T08:00:00.000Z" }
            }
        },
        model: User
    })
    @ApiBadRequestResponse({
        errors: [MESSAGE_TEXT.REFRESH_TOKEN_INCORRECT],
        message: 'Bad Request'
    })
    async refreshToken(@Query('lang') langDto: LangDto, @Body() refreshDto: RefreshDto, @I18n() i18n: I18nContext) {
        return this.authService.refreshToken(refreshDto.refreshToken, i18n);
    }

    @Get('verify-token')
    @ApiModelResponse({
        model: null,
        message: 'Verify success',
        status: HttpStatus.OK
    })
    @ApiOperation({ summary: 'Verify token' })
    @ApiBadRequestResponse({
        errors: [MESSAGE_TEXT.VERIFY_TOKEN_INCORRECT],
        message: 'Bad Request'
    })
    async verifyToken(@Query() verifyToken: VerifyDto, @I18n() i18n: I18nContext) {
        return this.authService.verifyToken(verifyToken.verifyToken, i18n);
    }

    @Post('reset-password')
    @ApiModelResponse({
        model: null,
        message: 'Reset password success',
        status: HttpStatus.OK
    })
    @ApiOperation({ summary: 'Reset password' })
    @ApiBadRequestResponse({
        errors: [MESSAGE_TEXT.FORGET_TOKEN_INCORRECT],
        message: 'Bad Request'
    })
    async resetPassword(@Query() verifyToken: ResetPassDto, @Body() newPassDto: NewPassDto, @I18n() i18n: I18nContext) {
        return this.authService.verifyForgetToken(verifyToken.resetPassToken, i18n, newPassDto.newPassword);
    }
}