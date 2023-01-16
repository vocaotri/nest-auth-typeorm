import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { ExistValidator } from '../validates/user_exist';

export class LoginDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'Email only for login normal login',
    })
    @IsNotEmpty()
    @IsEmail()
    @Validate(ExistValidator, ['email'])
    email: string;
    @ApiProperty({
        example: '123456',
        description: 'Password only for login normal login',
    })
    @IsNotEmpty()
    password: string;
}