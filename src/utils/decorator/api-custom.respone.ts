import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

interface IModelDecoratorApiResponse {
    model: Type<any>;
    message?: string;
    status: number;
    dataCustom?: IDataCustom;
}

interface IDataCustom {
    key: string;
    value: Record<string, SchemaObject | ReferenceObject>;
}

export const ApiCustomResponse = (
    options: IModelDecoratorApiResponse,
) => {
    const modelName = options.model.name.toLowerCase();
    const data: any = {
        properties: {
            [modelName]: {
                type: 'object',
                $ref: getSchemaPath(options.model)
            },
        }
    }
    if (options.dataCustom) {
        let { dataCustom } = options;
        data.properties = {
            ...data.properties,
            [dataCustom.key]: {
                type: 'object',
                properties: dataCustom.value
            }
        }
    }
    return applyDecorators(
        ApiExtraModels(options.model),
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
                        default: options.message || 'Successfully received model item',
                    }
                },
            },
        }),
    )
}