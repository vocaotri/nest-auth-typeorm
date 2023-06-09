import {
  ArgumentsHost,
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
    let message = exceptionResponse.message;
    if (typeof message === 'string') message = [message];
    response.status(statusCode).json({
      statusCode: response.statusCode,
      message: message,
      error: error,
    });
  }
}