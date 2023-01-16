import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

interface IBADREQUESTDecoratorApiResponse {
    message: string[];
    status?: number;
    error: string;
}

export const ApiBadrequestResponse = <TModel extends Type<any>>(
    options: IBADREQUESTDecoratorApiResponse,
) => {
    return applyDecorators(
        ApiBadRequestResponse({
            status: options.status || 400,
            description: options.message[0] || 'Successfully received model item',
            schema: {
                properties: {
                    status: {
                        type: 'number',
                        default: options.status || 400,
                    },
                    message: {
                        type: 'array',
                        default: options.message || 'Bad Request',
                    },
                    error: {
                        type: 'string',
                        default: options.error || 'Bad Request',
                    }
                },
            },
        }),
    )
}