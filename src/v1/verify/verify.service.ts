import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Verify, VerifyTokenType } from './verify.entity';
import { IsNull, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { MailService } from '../mail/mail.service';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VerifyService {
    constructor(
        @InjectRepository(Verify)
        private verifyRepository: Repository<Verify>,
        private readonly configService: ConfigService,
        private mailService: MailService,
    ) { }

    async createVerify(type: VerifyTokenType, user: User): Promise<Verify> {
        const token = uuidv4();
        const tokenBase64 = Buffer.from(token).toString('base64');
        const msTokenEXP = ms(this.configService.get('TOKEN_EXPIRATION_TIME'));
        const verify = new Verify();
        verify.tokenType = type;
        verify.user = user;
        verify.token = token;
        verify.expirationDate = new Date(Date.now() + msTokenEXP);
        this.mailService.sendEmailChangeEmailAddressVerifyNewEmail({
            toEmail: user.email,
            data: {
                token: tokenBase64,
            }
        });
        return await this.verifyRepository.save(verify);
    }
    // share service
    async getVerify(tokenDecode: string): Promise<Verify> {
        const verify = await this.verifyRepository.findOne({
            where: {
                token: tokenDecode,
                usedAt: IsNull()
            },
            relations: ['user']
        });
        if (!verify) {
            throw new BadRequestException('Verify token is incorrect');
        }
        verify.usedAt = new Date();
        await this.verifyRepository.save(verify);
        return verify;
    }
}
