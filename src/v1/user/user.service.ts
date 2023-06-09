import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
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

    countUser(filter: {}) {
        return this.userRepository.count(filter);
    }
}
