import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response as ResponseEx } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T | object;
    messages?: string | string[];
    statusCode?: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private message: string;
    constructor(
    ) {
        this.message = 'success';
    }
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map(dataE => {
            const dataEFormat = instanceToPlain(dataE)
            return {
                data: dataEFormat.data || dataEFormat,
                messages: dataEFormat.message || this.message,
                statusCode: dataEFormat.statusCode || context.switchToHttp().getResponse<ResponseEx>().statusCode,
            };
        }));
    }
}