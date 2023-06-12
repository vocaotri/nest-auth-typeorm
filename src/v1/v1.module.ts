import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { V1Route } from './v1.route';
import { AccessTokenModule } from './access-token/access-token.module';
import { AdminModule } from './admin/admin.module';
import { VerifyModule } from './verify/verify.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [V1Route, AuthModule, UserModule, AccessTokenModule, AdminModule, VerifyModule, MailModule]
})
export class V1Module { }
