import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { ExistValidator } from '../validates/user-exist';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class RegisterDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'Email only for login normal login',
    })
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_NOT_EMPTY', { attribute_name: "email" })
    })
    @IsEmail({}, {
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_IS_EMAIL', { attribute_name: "email" })
    })
    @Validate(ExistValidator, ['email'], { message: i18nValidationMessage<I18nTranslations>('message.ATTR_EXIST', { attribute_name: "email" }) })
    email: string;

    @ApiProperty({
        example: '0154532xxxx',
        description: 'Phone only for login normal login',
    })
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_NOT_EMPTY', { attribute_name: "phone" })
    })
    @Validate(ExistValidator, ['phone'], { message: i18nValidationMessage<I18nTranslations>('message.ATTR_EXIST', { attribute_name: "phone" }) })
    phone: string;

    @ApiProperty({
        example: '123456',
        description: 'Password only for login normal login',
    })
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_NOT_EMPTY', { attribute_name: "password" })
    })
    @MinLength(6, {
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_MIN_LENGTH', { attribute_name: "password" })
    })
    password: string;


    @ApiProperty({
        example: 'usernameeee',
        description: 'username',
    })
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_NOT_EMPTY', { attribute_name: "username" })
    })
    @Validate(ExistValidator, ['username'], { message: i18nValidationMessage<I18nTranslations>('message.ATTR_EXIST', { attribute_name: "username" }) })
    username: string;
}