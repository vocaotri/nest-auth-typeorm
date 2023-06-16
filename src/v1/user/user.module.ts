import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyModule } from '../verify/verify.module';
import { UserLoginExistValidator } from './validates/user-login-exist';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    VerifyModule,
    MailModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserLoginExistValidator],
  exports: [UserService]
})
export class UserModule { }
