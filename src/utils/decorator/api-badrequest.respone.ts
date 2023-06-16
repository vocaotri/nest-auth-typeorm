import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse as  ApiBadRequestRes} from '@nestjs/swagger';

interface IBADREQUESTDecoratorApiResponse {
    message: string;
    status?: number;
    errors:  string[];
}

export const ApiBadRequestResponse =(
    options: IBADREQUESTDecoratorApiResponse,
) => {
    return applyDecorators(
        ApiBadRequestRes({
            status: options.status || 400,
            description: options.message || 'Bad Request',
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
                        default: options.errors || 'Bad Request',
                    }
                },
            },
        }),
    )
}