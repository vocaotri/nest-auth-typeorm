import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }
  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: this.configService.get('database.type'),
      host: this.configService.get('database.host'),
      port: +this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: (this.configService.get('database.password') || "").toString(),
      database: this.configService.get('database.database' || "").toString(),
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 3,
      logging: false,
    };
  }
}
