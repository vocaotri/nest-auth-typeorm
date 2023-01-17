import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async validateToken(hash: any) {
        throw new Error('Method not implemented.');
    }
}
