import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from './access-token.entity';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';

@Injectable()
export class AccessTokenService {
    constructor(
        @InjectRepository(AccessToken)
        private accessTokenRepository: Repository<AccessToken>
    ) { }

    async createAccessToken(accessToken: AccessToken, removeOtherToken: boolean = false) {
        if (removeOtherToken) {
            await this.revokeTokenByUserId(accessToken.user.id);
        }
        const newAccessToken = await this.accessTokenRepository.save(accessToken);
        return newAccessToken;
    }

    async findByToken(tokenDecrypt: string) {
        return await this.accessTokenRepository.findOne({
            where: {
                token: tokenDecrypt,
                expirationDate: MoreThanOrEqual(new Date()),
                revokedAt: IsNull()
            },
            relations: ['user']
        })
    }

    async revokeTokenById(id: number) {
        return await this.accessTokenRepository.update(id, { revokedAt: new Date() });
    }

    async revokeTokenByUserId(userId: number) {
        return await this.accessTokenRepository.update({
            userId: userId,
            revokedAt: IsNull()
        }, { revokedAt: new Date() });
    }

    async findByRefreshToken(refreshTokenDecrypt: string): Promise<AccessToken> {
        return await this.accessTokenRepository.findOne({
            where: {
                refreshToken: refreshTokenDecrypt,
                refreshExpirationDate: MoreThanOrEqual(new Date()),
                revokedAt: IsNull()
            },
            relations: ['user']
        });
    }

    async updateLastUsed(id: number) {
        return await this.accessTokenRepository.update(id, { lastUsedAt: new Date() });
    }

}
