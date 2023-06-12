import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from './access-token.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AccessTokenService {
    constructor(
        @InjectRepository(AccessToken)
        private accessTokenRepository: Repository<AccessToken>
    ) { }

    createAccessToken(accessToken: AccessToken) {
        return this.accessTokenRepository.save(accessToken);
    }

    async findByToken(tokenDecrypt: string) {
        return await this.accessTokenRepository.findOne({
            where: {
                token: tokenDecrypt,
                expirationDate: MoreThanOrEqual(new Date()),
                revokedAt: null
            },
            relations: ['user']
        })
    }

    async updateLastUsed(id: number) {
        return await this.accessTokenRepository.update(id, { lastUsedAt: new Date() });
    }

}
