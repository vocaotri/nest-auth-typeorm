import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DbExceptionFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) { }
    catch(exception: any, host: ArgumentsHost) {
        const isProduction = this.configService.get('APP_DEBUG') === 'false';
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        console.log(exception);
        const status = new InternalServerErrorException().getStatus();

        const body: any = {
            messages: [
                isProduction
                    ? 'DB Error'
                    : `${exception.message}. SQL: ${exception.sql}`,
            ],
            statusCode: 500,
            error: "Database Error",
        };

        response.status(status).json(body);
    }
}
