import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExistValidator } from './validates/user_exist';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, ExistValidator]
})
export class AuthModule { }
