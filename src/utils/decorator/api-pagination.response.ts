import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface IPaginatedDecoratorApiResponse {
  model: Type<any>;
  message?: string;
  status?: number;
}

export const ApiPaginatedResponse = (
  options: IPaginatedDecoratorApiResponse,
) => {
  const modelName = options.model.name.toLowerCase();
  const data: any = {
    properties: {
      [modelName]: {
        type: 'array',
        $ref: getSchemaPath(options.model)
      },
      meta: {
        type: 'object',
        default: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 2,
          totalPages: 1,
          currentPage: 1,
        },
      }
    },
  }
  return applyDecorators(
    ApiExtraModels(options.model),
    ApiResponse({
      status: options.status || 200,
      description: options.message || 'Successfully received model list',
      schema: {
        properties: {
          data: data,
          status: {
            type: 'number',
            default: 200 || options.status,
          },
          message: {
            type: 'string',
            default: options.message,
          }
        },
      },
    }),
  );
};

