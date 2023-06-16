import { ValidationPipe } from '@nestjs/common';
import { NestFactory, repl } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { ADMIN_ACCESS_TOKEN, USER_ACCESS_TOKEN } from './constants/token-name';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const replServer = await repl(AppModule);
  replServer.setupHistory(".nestjs_repl_history", (err) => {
    if (err) {
      console.error(err);
    }
  });
  app.useGlobalPipes(
    new I18nValidationPipe(),
    // new ValidationPipe()
  );
  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors: false,
    // errorFormatter: (validationErrors) => {
    //   // return array key and error message
    //   return validationErrors.map((error) => {
    //     return {
    //       key: error.property,
    //       message: error.constraints[Object.keys(error.constraints)[0]],
    //     };
    //   });
    // }
  }),
    // new HttpExceptionFilter()
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .setDescription('The nestjs auth API jwt typeorm nestjs swagger')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, USER_ACCESS_TOKEN)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, ADMIN_ACCESS_TOKEN)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
