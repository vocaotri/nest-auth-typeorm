import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    const error = exceptionResponse.error;
    let errors = exceptionResponse.message;
    if (typeof errors === 'string') errors = [errors];
    response.status(statusCode).json({
      statusCode: response.statusCode,
      messages: error,
      errors: errors,
    });
  }
}