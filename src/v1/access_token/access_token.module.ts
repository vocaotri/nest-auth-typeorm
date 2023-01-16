import { Module } from '@nestjs/common';
import { AccessTokenController } from './access_token.controller';
import { AccessTokenService } from './access_token.service';

@Module({
  controllers: [AccessTokenController],
  providers: [AccessTokenService]
})
export class AccessTokenModule {}
