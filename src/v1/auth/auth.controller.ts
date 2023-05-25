import { Body, Controller, Delete, HttpStatus, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMINACCESSTOKEN, USERACCESSTOKEN } from 'src/contants/token-name';
import { ApiBadrequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiCustomResponse } from 'src/utils/decorator/api-custome.respone';
import { ApiModelResponse } from 'src/utils/decorator/api-model.respone';
import { UserRolePublic } from '../user/enums/UserRole';
import { User } from '../user/user.entity';
import { Auths } from './decorator/auths.decorator';
import { LoginDto } from './dto/login.dto';

@Controller()
@ApiTags('auth')
export class AuthController {
    @Post('login')
    @ApiOperation({ summary: 'Login (User-Admin)' })
    // respone with pagination
    // @ApiPaginatedResponse({
    //     model: User,
    //     description: 'Success. Returns users',
    //     status: 201
    // })
    // respone with model
    // @ApiModelResponse({
    //     model: User,
    //     description: 'Success. Returns user',
    //     status: 201
    // })
    // respone custom
    @ApiCustomResponse({
        status: HttpStatus.OK,
        description: 'Success. Returns access token',
        data_custom: {
            access_token: { type: 'string', example: "jwt_token" },
            expiration_date: { type: 'string', example: "2021-08-01T08:00:00.000Z" },
            refresh_token: { type: 'string', example: "refresh_token", },
            refresh_expiration_date: { type: 'string', example: "2021-08-01T08:00:00.000Z" }
        }
    })
    @ApiBadrequestResponse({
        error: 'Bad Request',
        message: ['Username or password is incorrect']
    })
    async login(@Body() loginDto: LoginDto) {
        return 'login';
    }

    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.CREATED
    })
    @ApiBadrequestResponse({
        error: 'Bad Request',
        message: ['Phone number is already in use']
    })
    @Post('register')
    @ApiOperation({ summary: 'Register (User)' })
    async register() {
        return 'register';
    }

    @ApiModelResponse({
        model: User,
        description: 'Success. Returns user',
        status: HttpStatus.ACCEPTED
    })
    @Delete('logout')
    @ApiOperation({ summary: 'Logout (User-Admin)' })
    @ApiNotFoundResponse({
        description: 'Not Found',
        status: HttpStatus.NOT_FOUND,
        schema: {
            properties: {
                status: {
                    type: 'number',
                    default: HttpStatus.NOT_FOUND,
                },
                message: {
                    type: 'string',
                    default: 'Not Found',
                }
            }
        }
    })
    @Auths([UserRolePublic.USER, UserRolePublic.ADMIN], [USERACCESSTOKEN, ADMINACCESSTOKEN])
    async logout() {
        return 'logout';
    }
}