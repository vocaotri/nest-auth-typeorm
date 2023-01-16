import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '../dto/paginated.dto';

interface IPaginatedDecoratorApiResponse {
  model: Type<any>;
  description?: string;
  status?: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  options: IPaginatedDecoratorApiResponse,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto),
    ApiExtraModels(options.model),
    ApiResponse({
      status: options.status || 200,
      description: options.description || 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                properties:{
                  type:{
                    type: 'string',
                    default: 'paginated',
                  },
                  items:{
                    type: 'array',
                    items: { $ref: getSchemaPath(options.model) },
                  },
                  meta:{
                    type: 'object',
                    default: {
                          totalItems: 2,
                          itemCount: 2,
                          itemsPerPage: 2,
                          totalPages: 1,
                          currentPage: 1,
                        },
                  }
                }
              },
              status: {
                type: 'number',
              },
              message: {
                type: 'string',
              }
            },
          },
        ],
      },
    }),
  );
};

