import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { Response } from 'src/utils/interceptors/transform.interceptor';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(user: RegisterDto): Promise<Response<User>> {
        // convert dto to entity
        user = Object.assign(new User(), user);
        const newUser = await this.userRepository.save(user);
        return {
            data: newUser,
            message: 'Success. Returns user',
        };
    }
    // share service
    async getUser(filter: FindOptionsWhere<User> | FindOptionsWhere<User>[]): Promise<User> {
        const user = await this.userRepository.findOneOrFail({
            where: filter
        });
        return user;
    }

    async countUser(filter: {}) {
        return this.userRepository.count({
            where: filter
        });
    }
}
