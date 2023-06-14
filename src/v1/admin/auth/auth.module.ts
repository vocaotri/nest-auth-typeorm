import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthModule as UAuthModule } from 'src/v1/auth/auth.module';
import { UserModule as UUserModule } from 'src/v1/user/user.module';
import { AccessTokenModule } from 'src/v1/access-token/access-token.module';

@Module({
  imports: [
    UAuthModule,
    UUserModule,
    AccessTokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
