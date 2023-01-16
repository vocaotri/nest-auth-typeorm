import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { V1Route } from './v1.route';
import { AccessTokenModule } from './access_token/access_token.module';

@Module({
  imports: [V1Route, AuthModule, UserModule, AccessTokenModule]
})
export class V1Module { }
