import { Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    constructor(private readonly configService: ConfigService) {
        super();
    }
    catch(exception: any, host: ArgumentsHost) {
        const isProduction = this.configService.get('APP_DEBUG') === 'false';
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        console.log(exception);

        const body: any = {
            message: 'Internal Server Error',
            errors: [
                isProduction ? 'Internal Server Error' : `${exception.message}.`,
            ],
            statusCode: 500,
        };

        response.status(500).json(body);

    }
}