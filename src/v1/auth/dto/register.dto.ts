import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { ExistValidator } from '../validates/user-exist';

export class RegisterDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'Email only for login normal login',
    })
    @IsNotEmpty()
    @IsEmail()
    @Validate(ExistValidator, ['email'])
    email: string;

    @ApiProperty({
        example: '0154532xxxx',
        description: 'Phone only for login normal login',
    })
    @IsNotEmpty()
    @Validate(ExistValidator, ['phone'])
    phone: string;

    @ApiProperty({
        example: '123456',
        description: 'Password only for login normal login',
    })
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'usernameeee',
        description: 'username',
    })
    username: string;
}