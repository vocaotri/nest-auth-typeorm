import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { I18nContext } from 'nestjs-i18n';
import { MESSAGE_TEXT } from 'src/constants/message';
import { Response } from 'src/utils/interceptors/transform.interceptor';
import { decryptData, encryptData } from 'src/utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { AccessToken } from '../access-token/access-token.entity';
import { AccessTokenService } from '../access-token/access-token.service';
import { MailService } from '../mail/mail.service';
import { User, UserStatus } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { VerifyTokenType } from '../verify/verify.entity';
import { VerifyService } from '../verify/verify.service';
import { ForgetPassDto } from './dto/forget-pass.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private accessTokenService: AccessTokenService,
        private verifyService: VerifyService,
        private configService: ConfigService,
        private mailService: MailService,
    ) { }

    async validateToken(hash: any) {
        let tokenDecrypt = decryptData(hash);
        let userAccessToken = await this.accessTokenService.findByToken(tokenDecrypt);
        if (userAccessToken && userAccessToken.user) {
            if (userAccessToken.user.status === UserStatus.INACTIVE) {
                throw new ForbiddenException(MESSAGE_TEXT.USER_NOT_ACTIVE);
            }
            const user: User = userAccessToken.user;
            await this.accessTokenService.updateLastUsed(userAccessToken.id);
            user.currentAccessTokenId = userAccessToken.id;
            return userAccessToken.user;
        }
    }

    generateToken() {
        const tokenMint = uuidv4();
        const tokenEncrypted = encryptData(tokenMint);
        const tokenRefreshMint = uuidv4();
        const tokenRefreshEncrypted = encryptData(tokenRefreshMint);
        const payload = { hash: tokenEncrypted };
        const token = this.jwtService.sign(payload);
        const tokenDecode = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const tokenExp = new Date(tokenDecode.exp * 1000);
        // tokenRefreshExp greater than tokenExp 30 days
        const tokenRefreshExp = new Date(tokenExp.getTime() + 30 * 24 * 60 * 60 * 1000);
        return {
            tokenMint: tokenMint,
            tokenEncrypted: tokenEncrypted,
            tokenRefreshMint: tokenRefreshMint,
            tokenRefreshEncrypted: tokenRefreshEncrypted,
            payload: payload,
            token: token,
            tokenDecode: tokenDecode,
            tokenExp: tokenExp,
            tokenRefreshExp: tokenRefreshExp
        }
    }

    async login(loginDto: LoginDto, i18n: I18nContext): Promise<Response<{ user: User, token: any }>> {
        const isolateLogin = this.configService.get('ISOLATE_LOGIN') === 'true';
        const user = await this.userService.getUser({ email: loginDto.email });
        if (!user) {
            throw new BadRequestException(i18n.t('message.LOGIN_FAIL'));
        }
        if (user.status != UserStatus.ACTIVE) {
            throw new ForbiddenException(i18n.t('message.USER_NOT_ACTIVE'));
        }
        const isMatch = await compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException(i18n.t('message.LOGIN_FAIL'));
        }
        const { tokenMint, tokenRefreshMint, tokenRefreshEncrypted, token, tokenExp, tokenRefreshExp } = this.generateToken();
        const accessToken = new AccessToken();
        accessToken.user = user;
        accessToken.token = tokenMint;
        accessToken.expirationDate = tokenExp;
        accessToken.refreshToken = tokenRefreshMint;
        accessToken.refreshExpirationDate = tokenRefreshExp;
        await this.accessTokenService.createAccessToken(accessToken, isolateLogin);
        return {
            data: {
                user: user,
                token: {
                    accessToken: token,
                    expirationDate: tokenExp,
                    refreshToken: tokenRefreshEncrypted,
                    refreshExpirationDate: tokenRefreshExp
                }
            },
            messages: 'Success. Returns user',
        }
    }

    async refreshToken(refreshToken: string, i18n: I18nContext) {
        const isolateLogin = this.configService.get('ISOLATE_LOGIN') === 'true';
        const refreshTokenDecrypt = decryptData(refreshToken);
        const userAccessToken = await this.accessTokenService.findByRefreshToken(refreshTokenDecrypt);
        if (!userAccessToken) {
            throw new BadRequestException(i18n.t('message.REFRESH_TOKEN_FAIL'));
        }
        if (userAccessToken.user.status != UserStatus.ACTIVE) {
            throw new ForbiddenException(i18n.t('message.USER_NOT_ACTIVE'));
        }
        const { tokenMint, tokenRefreshMint, tokenRefreshEncrypted, token, tokenExp, tokenRefreshExp } = this.generateToken();
        const accessToken = new AccessToken();
        accessToken.user = userAccessToken.user;
        accessToken.token = tokenMint;
        accessToken.expirationDate = tokenExp;
        accessToken.refreshToken = tokenRefreshMint;
        accessToken.refreshExpirationDate = tokenRefreshExp;
        await this.accessTokenService.createAccessToken(accessToken, isolateLogin);
        await this.accessTokenService.revokeTokenById(userAccessToken.id);
        return {
            data: {
                user: userAccessToken.user,
                token: {
                    accessToken: token,
                    expirationDate: tokenExp,
                    refreshToken: tokenRefreshEncrypted,
                    refreshExpirationDate: tokenRefreshExp
                }
            },
            message: 'Success. Returns user',
        }
    }

    async logout(user: User): Promise<Response<{ data: any }>> {
        const isolateLogin = this.configService.get('ISOLATE_LOGIN') === 'true';
        if (!isolateLogin) {
            await this.accessTokenService.revokeTokenById(user.currentAccessTokenId);
        } else {
            await this.accessTokenService.revokeTokenByUserId(user.id);
        }
        return {
            data: {},
            messages: 'Logout success'
        };
    }

    async forgetPassword(forgetPasswordDto: ForgetPassDto, i18n: I18nContext) {
        const user = await this.userService.getUser({ email: forgetPasswordDto.email });
        if (user.status != UserStatus.ACTIVE) {
            throw new BadRequestException(i18n.t('message.USER_NOT_ACTIVE'));
        }
        const tokenBase64 = await this.verifyService.createVerify(VerifyTokenType.FORGET_PASSWORD, user);
        const tokenUrl = `${this.configService.get('APP_URL')}/api/v1/auth/verify-forget-token/?verifyToken=${tokenBase64}`;
        this.mailService.sendEmailChangePassword({
            toEmail: user.email,
            data: {
                tokenUrl: tokenUrl,
            }
        });
        return {};
    }

    async verifyToken(verifyToken: string, i18n: I18nContext): Promise<Response<{ data: any }>> {
        const verifyTokenBase64Decode = Buffer.from(verifyToken, 'base64').toString();
        const userVerifyToken = await this.verifyService.getVerify(verifyTokenBase64Decode, VerifyTokenType.EMAIL, i18n);
        await this.userService.activeUser(userVerifyToken.user.id);
        return {
            data: {},
            messages: 'Verify success'
        }
    }

    async verifyForgetToken(verifyToken: string, i18n: I18nContext, newPassword: string): Promise<Response<{ data: any }>> {
        const verifyTokenBase64Decode = Buffer.from(verifyToken, 'base64').toString();
        const userVerifyToken = await this.verifyService.getVerify(verifyTokenBase64Decode, VerifyTokenType.FORGET_PASSWORD, i18n);
        const user = await this.userService.getUser({ id: userVerifyToken.user.id });
        user.password = newPassword;
        await this.userService.update({
            id: user.id,
        }, user);
        return {
            data: {},
            messages: 'Reset password success'
        }
    }
}
