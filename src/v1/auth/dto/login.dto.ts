import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { NotExistValidator } from '../validates/user-not-exist';

export class LoginDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'Email only for login normal login',
    })
    @IsNotEmpty()
    @IsEmail()
    @Validate(NotExistValidator, ['email'], { message: i18nValidationMessage<I18nTranslations>('message.LOGIN_FAIL') })
    email: string;
    @ApiProperty({
        example: '123456',
        description: 'Password only for login normal login',
    })
    @IsNotEmpty()
    password: string;
}