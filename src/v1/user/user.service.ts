import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './user.entity';
import { FindOptionsWhere, ObjectId, Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { Response } from 'src/utils/interceptors/transform.interceptor';
import { VerifyService } from '../verify/verify.service';
import { VerifyTokenType } from '../verify/verify.entity';
import { UpdateDto } from './dto/update.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private verifyService: VerifyService,
        private mailService: MailService,
        private configService: ConfigService,
    ) { }

    async createUser(user: RegisterDto): Promise<Response<User>> {
        // convert dto to entity
        user = Object.assign(new User(), user);
        const newUser = await this.userRepository.save(user);
        const tokenBase64 = await this.verifyService.createVerify(VerifyTokenType.EMAIL, newUser);
        const tokenUrl = `${this.configService.get('APP_URL')}/api/v1/auth/verify-token/?verifyToken=${tokenBase64}`;
        this.mailService.sendEmailChangeEmailAddressVerifyNewEmail({
            toEmail: user.email,
            data: {
                tokenUrl: tokenUrl,
            }
        });
        return {
            data: newUser,
            messages: 'Success. Returns user',
        };
    }

    async updateUserInfo(user: User, updateDto: UpdateDto): Promise<Response<User>> {
        // convert dto to entity
        const userConvert: User = Object.assign(new User(), updateDto);
        const userUpdated = await this.update({
            id: user.id
        }, userConvert);
        if (userUpdated.affected > 0) {
            user = await this.userRepository.findOneOrFail({
                where: {
                    id: user.id
                }
            });
        }
        return {
            data: user
        }
    }
    // share service
    async update(
        condition: string | number | string[] | Date | ObjectId | number[] | Date[] | ObjectId[] | FindOptionsWhere<User>,
        userUpdate: User
    ) {
        const userUpdated = await this.userRepository.update(condition, userUpdate);
        return userUpdated;
    }

    async activeUser(id: number) {
        const userUpdate = await this.userRepository.update({
            id: id,
            status: UserStatus.INACTIVE
        }, {
            status: UserStatus.ACTIVE
        });
        return userUpdate
    }

    async getUser(filter: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<User> {
        const user = await this.userRepository.findOne({
            where: filter
        });
        return user;
    }

    async countUser(filter: {}) {
        return this.userRepository.count({
            where: filter
        });
    }

    async countUserOwn(filter: {}, owner: User) {
        // convert filter to array
        const filterKey = Object.keys(filter);
        const filterValue = Object.values(filter);
        if (owner[filterKey[0]] != filterValue[0])
            return this.userRepository.count({
                where: filter
            });
        return 0;
    }
}
