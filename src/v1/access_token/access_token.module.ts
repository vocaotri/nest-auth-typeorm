import { Module } from '@nestjs/common';
import { AccessTokenController } from './access_token.controller';
import { AccessTokenService } from './access_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './access_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessToken]),
  ],
  controllers: [AccessTokenController],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
