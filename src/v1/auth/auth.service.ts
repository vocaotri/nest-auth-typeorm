import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { Response } from 'src/utils/interceptors/transform.interceptor';
import { User } from '../user/user.entity';
import { encryptData } from 'src/utils/utils';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    async validateToken(hash: any) {
        throw new Error('Method not implemented.');
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

    async login(loginDto: LoginDto): Promise<Response<User>> {
        const user = await this.userService.getUser({ email: loginDto.email });
        const isMatch = await compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Email or password is incorrect');
        }
        const { tokenMint, tokenRefreshMint, tokenRefreshEncrypted, token, tokenExp, tokenRefreshExp } = this.generateToken();
        console.log(tokenMint, tokenRefreshMint, tokenRefreshEncrypted, token, tokenExp, tokenRefreshExp);
        return {
            data: user,
            message: 'Success. Returns user',
        }
    }
}
