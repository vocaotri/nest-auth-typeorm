import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as ms from 'ms';
import { I18nContext } from 'nestjs-i18n';
import { IsNull, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';
import { Verify, VerifyTokenType } from './verify.entity';
import { I18nPath } from 'src/generated/i18n.generated';

@Injectable()
export class VerifyService {
    constructor(
        @InjectRepository(Verify)
        private verifyRepository: Repository<Verify>,
        private readonly configService: ConfigService,
    ) { }
    // share service
    async createVerify(type: VerifyTokenType, user: User): Promise<string> {
        const token = uuidv4();
        const tokenBase64 = Buffer.from(token).toString('base64');
        const msTokenEXP = ms(this.configService.get('TOKEN_EXPIRATION_TIME'));
        const verify = new Verify();
        verify.tokenType = type;
        verify.user = user;
        verify.token = token;
        verify.expirationDate = new Date(Date.now() + msTokenEXP);
        await this.verifyRepository.save(verify)
        return tokenBase64;
    }

    async getVerify(tokenDecode: string, verifyTokenType: VerifyTokenType = VerifyTokenType.EMAIL, i18n: I18nContext): Promise<Verify> {
        const verify = await this.verifyRepository.findOne({
            where: {
                token: tokenDecode,
                usedAt: IsNull()
            },
            relations: ['user']
        });
        if (!verify) {
            switch (verifyTokenType) {
                case VerifyTokenType.FORGET_PASSWORD:
                    throw new BadRequestException(i18n.t<I18nPath>('message.FORGET_TOKEN_FAIL'));
                default:
                    throw new BadRequestException(i18n.t<I18nPath>('message.VERIFY_TOKEN_FAIL'));
            }
        }
        verify.usedAt = new Date();
        await this.verifyRepository.save(verify);
        return verify;
    }
}
