import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedApiResponseDto } from '../dto/paginated-response.dto';

export const PaginatedApiResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiQuery({ name: 'order', type: 'string', required: false }),
    ApiQuery({ name: 'skip', type: 'number', required: false, example: '0' }),
    ApiQuery({ name: 'take', type: 'number', required: false, example: '10' }),
    ApiExtraModels(PaginatedApiResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedApiResponseDto) },
          {
            properties: {
              skippedRecords: {
                type: 'number',
              },
              totalRecords: {
                type: 'number',
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              payloadSize: {
                type: 'number',
              },
              hasNext: {
                type: 'boolean',
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Not authenticated',
      schema: {
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          code: {
            type: 'number',
            example: 401,
          },
          errorId: {
            type: 'string',
            example: 'UNAUTHORIZED',
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
          stack: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          timestamp: {
            type: 'number',
            example: 1617826799860,
          },
          path: {
            type: 'string',
            example: '/api/v1/services',
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Access denied',
      schema: {
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          code: {
            type: 'number',
            example: 403,
          },
          errorId: {
            type: 'string',
            example: 'FORBIDDEN',
          },
          message: {
            type: 'string',
            example: 'Forbidden resource',
          },
          error: {
            type: 'string',
            example: 'Forbidden',
          },
          stack: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          timestamp: {
            type: 'number',
            example: 1617826799860,
          },
          path: {
            type: 'string',
            example: '/api/v1/services',
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiInternalServerErrorResponse({
      description: 'Server error',
      schema: {
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          code: {
            type: 'number',
            example: 500,
          },
          errorId: {
            type: 'string',
            example: 'INTERNAL_SERVER_ERROR',
          },
          message: {
            type: 'string',
            example: 'Internal server error',
          },
          error: {
            type: 'string',
            example: 'Error',
          },
          stack: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          timestamp: {
            type: 'number',
            example: 1617826799860,
          },
          path: {
            type: 'string',
            example: '/api/v1/services',
          },
        },
      },
    }),
  );
};
