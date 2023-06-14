import { BadRequestException, ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { Response } from 'src/utils/interceptors/transform.interceptor';
import { User, UserStatus } from '../user/user.entity';
import { decryptData, encryptData } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { AccessToken } from '../access-token/access-token.entity';
import { AccessTokenService } from '../access-token/access-token.service';
import { ConfigService } from '@nestjs/config';
import { VerifyService } from '../verify/verify.service';
import { MESSAGE_TEXT } from 'src/constants/message';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private accessTokenService: AccessTokenService,
        private verifyService: VerifyService,
        private configService: ConfigService
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

    async login(loginDto: LoginDto): Promise<Response<{ user: User, token: any }>> {
        const isolateLogin = this.configService.get('ISOLATE_LOGIN') === 'true';
        const user = await this.userService.getUser({ email: loginDto.email });
        if (!user) {
            throw new BadRequestException(MESSAGE_TEXT.LOGIN_FAIL);
        }
        if (user.status != UserStatus.ACTIVE) {
            throw new ForbiddenException(MESSAGE_TEXT.USER_NOT_ACTIVE);
        }
        const isMatch = await compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException(MESSAGE_TEXT.LOGIN_FAIL);
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

    async refreshToken(refreshToken: string) {
        const isolateLogin = this.configService.get('ISOLATE_LOGIN') === 'true';
        const refreshTokenDecrypt = decryptData(refreshToken);
        const userAccessToken = await this.accessTokenService.findByRefreshToken(refreshTokenDecrypt);
        if (!userAccessToken) {
            throw new BadRequestException(MESSAGE_TEXT.REFRESH_TOKEn_INCORRECT);
        }
        if (userAccessToken.user.status != UserStatus.ACTIVE) {
            throw new ForbiddenException(MESSAGE_TEXT.USER_NOT_ACTIVE);
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

    async verifyToken(verifyToken: string): Promise<Response<{ data: any }>> {
        const verifyTokenBase64Decode = Buffer.from(verifyToken, 'base64').toString();
        const userVerifyToken = await this.verifyService.getVerify(verifyTokenBase64Decode);
        if (!userVerifyToken) {
            throw new BadRequestException(MESSAGE_TEXT.VERIFY_TOKEN_INCORRECT);
        }
        await this.userService.activeUser(userVerifyToken.user.id);
        return {
            data: {},
            messages: 'Verify success'
        }
    }
}
