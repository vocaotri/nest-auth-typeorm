import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBadrequestResponse } from 'src/utils/decorator/api-badrequest.respone';
import { ApiCustomResponse } from 'src/utils/decorator/api-custome.respone';
import { LoginDto } from 'src/v1/auth/dto/login.dto';

@Controller()
@ApiTags('AAuth')
export class AuthController {
    @Post('login')
    @ApiOperation({ summary: 'Login' })
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
}
