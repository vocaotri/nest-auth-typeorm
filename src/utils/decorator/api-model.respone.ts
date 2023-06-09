import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface IModelDecoratorApiResponse {
    model?: Type<any>;
    message?: string;
    status: number;
}

export const ApiModelResponse = (
    options: IModelDecoratorApiResponse,
) => {
    let apiExtraModels = null;
    let data: any = {
        properties: {}
    };
    if (options.model) {
        const modelName = options.model.name.toLowerCase();
        data = {
            properties: {
                [modelName]: {
                    type: 'object',
                    $ref: getSchemaPath(options.model)
                },
            }
        }
        apiExtraModels = ApiExtraModels(options.model);
    }
    let decorators = [
        ApiResponse({
            status: options.status || 200,
            description: options.message || 'Successfully received model item',
            schema: {
                properties: {
                    data: data,
                    status: {
                        type: 'number',
                        default: options.status || 200,
                    },
                    message: {
                        type: 'string',
                        default: options.message || 'Successfully received model item ',
                    }
                },
            },
        }),
    ]
    if (apiExtraModels) decorators.push(apiExtraModels);
    return applyDecorators(
        ...decorators,
    )
}