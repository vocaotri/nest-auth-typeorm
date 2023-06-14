import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/v1/auth/dto/login.dto';
import { AuthService as UAuthService } from 'src/v1/auth/auth.service';
import { UserService as UUserService } from 'src/v1/user/user.service';
import { AccessTokenService } from 'src/v1/access-token/access-token.service';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from 'src/v1/user/user.entity';
import { compare } from 'bcrypt';
import { AccessToken } from 'src/v1/access-token/access-token.entity';
import { UserRole } from 'src/v1/user/enums/UserRole';
import { MESSAGE_TEXT } from 'src/constants/message';

@Injectable()
export class AuthService {
    constructor(
        private readonly authService: UAuthService,
        private readonly userService: UUserService,
        private readonly accessTokenService: AccessTokenService,
        private readonly configService: ConfigService
    ) { }

    async login(loginDto: LoginDto) {
        const isolateLogin = this.configService.get('ISOLATE_LOGIN') === 'true';
        const user = await this.userService.getUser({ email: loginDto.email, role: UserRole.ADMIN });
        if(!user) {
            throw new BadRequestException(MESSAGE_TEXT.LOGIN_FAIL);
        }
        if (user.status != UserStatus.ACTIVE) {
            throw new ForbiddenException(MESSAGE_TEXT.USER_NOT_ACTIVE);
        }
        const isMatch = await compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException(MESSAGE_TEXT.LOGIN_FAIL);
        }
        const { tokenMint, tokenRefreshMint, tokenRefreshEncrypted, token, tokenExp, tokenRefreshExp } = this.authService.generateToken();
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
}
