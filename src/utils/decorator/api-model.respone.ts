import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface IModelDecoratorApiResponse {
    model: Type<any>;
    description?: string;
    status: number;
}

export const ApiModelResponse = <TModel extends Type<any>>(
    options: IModelDecoratorApiResponse,
) => {
    return applyDecorators(
        ApiExtraModels(options.model),
        ApiResponse({
            status: options.status || 200,
            description: options.description || 'Successfully received model item',
            schema: {
                properties: {
                    data: {
                        properties: {
                            type: {
                                type: 'string',
                                default: 'single',
                            },
                            item: {
                                type: 'object',
                                $ref: getSchemaPath(options.model)
                            }
                        }
                    },
                    status: {
                        type: 'number',
                        default: options.status || 200,
                    },
                    message: {
                        type: 'array',
                    }
                },
            },
        }),
    )
}