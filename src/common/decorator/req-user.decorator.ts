import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type RequestUser = {
  id: string;
};

export const ReqUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser => {
    const request = context.switchToHttp().getRequest<Request>();

    return {
      id: request.headers['x-user-id'] as string,
    };
  },
);
