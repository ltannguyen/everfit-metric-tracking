import { ApiListResponseDto, ApiResponseDto } from '@common';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiResponse = <TModel extends Type<any>>(model?: TModel) => {
  const commonResponseDecorators = [
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
  ];

  return model
    ? applyDecorators(
        ApiExtraModels(ApiResponseDto, model),
        ApiOkResponse({
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  success: {
                    type: 'boolean',
                  },
                  code: {
                    type: 'number',
                  },
                  data: {
                    $ref: getSchemaPath(model),
                  },
                  timestamp: {
                    type: 'number',
                  },
                },
              },
            ],
          },
        }),
        ...commonResponseDecorators,
      )
    : applyDecorators(
        ApiOkResponse({
          schema: {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              code: {
                type: 'number',
                example: 200,
              },
              timestamp: {
                type: 'number',
                example: 1617826799860,
              },
            },
          },
        }),
        ...commonResponseDecorators,
      );
};

export const ApiListResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(ApiListResponseDto, model),
    ApiOkResponse({
      schema: {
        title: `ListResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(ApiListResponseDto) },
          {
            properties: {
              success: {
                type: 'boolean',
              },
              code: {
                type: 'number',
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              timestamp: {
                type: 'number',
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
