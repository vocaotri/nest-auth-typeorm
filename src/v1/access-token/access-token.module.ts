import { Module } from '@nestjs/common';
import { AccessTokenController } from './access-token.controller';
import { AccessTokenService } from './access-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './access-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessToken]),
  ],
  controllers: [AccessTokenController],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
