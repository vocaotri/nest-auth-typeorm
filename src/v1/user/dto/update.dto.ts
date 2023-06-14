import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString, Validate } from 'class-validator';
import { REQUEST_CONTEXT } from 'src/utils/interceptors/inject-user.interceptor';
import { UserLoginExistValidator } from '../validates/user-login-exist';

export class UpdateDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'Email only for login normal login',
    })
    @IsNotEmpty()
    @IsEmail()
    @Validate(UserLoginExistValidator, ['email'])
    email: string;

    @ApiProperty({
        example: '0154532xxxx',
        description: 'Phone only for login normal login',
    })
    @IsNotEmpty()
    @Validate(UserLoginExistValidator, ['phone'])
    phone: string;

    @ApiProperty({
        example: '123456',
        description: 'Password only for login normal login',
        nullable: true,
    })
    @IsString()
    password?: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'usernameeee',
        description: 'username',
    })
    @Validate(UserLoginExistValidator, ['username'])
    username: string;

    @IsObject()
    [REQUEST_CONTEXT]: any;
}