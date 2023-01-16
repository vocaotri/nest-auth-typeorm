import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

interface IModelDecoratorApiResponse {
    description?: string;
    status: number;
    data_custom: Record<string, SchemaObject | ReferenceObject>;
}

export const ApiCustomResponse = <TModel extends Type<any>>(
    options: IModelDecoratorApiResponse,
) => {
    let { data_custom } = options;
    return applyDecorators(
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
                                properties: data_custom
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