import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import databaseConfig from './config/database.config';
import { TypeOrmConfigService } from './config/typeorm.config';
import { AllExceptionsFilter } from './utils/filters/all-exceptions.filter';
import { DbExceptionFilter } from './utils/filters/db-exception.filter';
import { TransformInterceptor } from './utils/interceptors/transform.interceptor';
import { V1Module } from './v1/v1.module';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
    V1Module,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DbExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ]
})
export class AppModule { }
