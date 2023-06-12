import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExistValidator } from './validates/user-exist';
import { NotExistValidator } from './validates/user-not-exist';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenModule } from '../access_token/access_token.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [UserModule, AccessTokenModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: { expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') },
    }),
    inject: [ConfigService],
  }),],
  controllers: [AuthController],
  providers: [AuthService, ExistValidator, NotExistValidator, JwtStrategy]
})
export class AuthModule { }
