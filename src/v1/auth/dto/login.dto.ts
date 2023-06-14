import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { NotExistValidator } from '../validates/user-not-exist';
import { MESSAGE_TEXT } from 'src/constants/message';

export class LoginDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'Email only for login normal login',
    })
    @IsNotEmpty()
    @IsEmail()
    @Validate(NotExistValidator, ['email'], { message: MESSAGE_TEXT.LOGIN_FAIL })
    email: string;
    @ApiProperty({
        example: '123456',
        description: 'Password only for login normal login',
    })
    @IsNotEmpty()
    password: string;
}