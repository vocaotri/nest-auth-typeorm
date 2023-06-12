import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBadRequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiCustomResponse } from 'src/utils/decorator/api-custom.respone';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { UserRole } from '../user/enums/UserRole';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auths.decorator';
import { GetUser } from './decorator/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
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
        error: 'Bad Request',
        message: ['Username or password is incorrect']
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
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
    async register(@Body() registerDto: RegisterDto) {
        return this.userService.createUser(registerDto);
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
    async logout(@GetUser() user: User) {
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
        error: 'Bad Request',
        message: ['Refresh token is incorrect']
    })
    async refreshToken(@Body() refreshDto: RefreshDto) {
        return this.authService.refreshToken(refreshDto.refreshToken);
    }
}