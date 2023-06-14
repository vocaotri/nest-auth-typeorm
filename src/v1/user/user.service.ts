import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { Response } from 'src/utils/interceptors/transform.interceptor';
import { VerifyService } from '../verify/verify.service';
import { VerifyTokenType } from '../verify/verify.entity';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private verifyService: VerifyService
    ) { }

    async createUser(user: RegisterDto): Promise<Response<User>> {
        // convert dto to entity
        user = Object.assign(new User(), user);
        const newUser = await this.userRepository.save(user);
        this.verifyService.createVerify(VerifyTokenType.EMAIL, newUser);
        return {
            data: newUser,
            messages: 'Success. Returns user',
        };
    }

    async update(user: User, updateDto: UpdateDto): Promise<Response<User>> {
        // convert dto to entity
        updateDto = Object.assign(new User(), updateDto);
        const userUpdate = await this.userRepository.update({
            id: user.id
        }, updateDto);
        if (userUpdate.affected > 0) {
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
