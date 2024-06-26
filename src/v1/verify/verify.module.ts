import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verify } from './verify.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Verify]),
    ],
    providers: [VerifyService],
    controllers: [VerifyController],
    exports: [VerifyService]
})
export class VerifyModule { }
