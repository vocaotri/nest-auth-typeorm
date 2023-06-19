import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString, MinLength, NotEquals, Validate, ValidateIf } from 'class-validator';
import { REQUEST_CONTEXT } from 'src/utils/interceptors/inject-user.interceptor';
import { UserLoginExistValidator } from '../validates/user-login-exist';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class UpdateDto {
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
    @Validate(UserLoginExistValidator, ['email'], { message: i18nValidationMessage<I18nTranslations>('message.ATTR_EXIST', { attribute_name: "email" }) })
    email: string;

    @ApiProperty({
        example: '0154532xxxx',
        description: 'Phone only for login normal login',
    })
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_NOT_EMPTY', { attribute_name: "phone" })
    })
    @Validate(UserLoginExistValidator, ['phone'], { message: i18nValidationMessage<I18nTranslations>('message.ATTR_EXIST', { attribute_name: "email" }) })
    phone: string;

    @ApiProperty({
        example: '123456',
        description: 'Password only for login normal login',
        nullable: true,
    })
    // check Optional
    @IsString({
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_IS_STRING', { attribute_name: "password" })
    })
    @MinLength(6, {
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_MIN_LENGTH', { attribute_name: "password" })
    })
    @NotEquals(null, {
        message: i18nValidationMessage<I18nTranslations>('message.ATTR_NOT_EMPTY', { attribute_name: "password" })
    })
    // check password
    // @IsStrongPassword()
    @ValidateIf((object, value) => value !== undefined)
    password?: string;

    @IsNotEmpty()
    @ApiProperty({
        example: 'usernameeee',
        description: 'username',
    })
    @Validate(UserLoginExistValidator, ['username'], { message: i18nValidationMessage<I18nTranslations>('message.USERNAME_EXIST') })
    username: string;

    @IsObject()
    [REQUEST_CONTEXT]: any;
}