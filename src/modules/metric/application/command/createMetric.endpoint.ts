import {
  ApiResponse,
  RequestUser,
  ReqUser,
  ResponseInterceptor,
} from '@common';
import {
  Body,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMetricCommand, CreateMetricRequestBody } from './createMetric';

@ApiTags('Metric')
@ApiHeader({
  name: 'x-user-id',
  example: 'b69b989c-789c-406e-8273-801d9a17bc4d',
  required: true,
  description: 'Default user id: b69b989c-789c-406e-8273-801d9a17bc4d',
})
@Controller({
  path: 'metrics',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class CreateMetricEndpoint {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly commandBus: CommandBus) {}

  @ApiOperation({ description: 'Creates a metric record' })
  @ApiResponse()
  @Post()
  create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateMetricRequestBody,
  ): Promise<void> {
    return this.commandBus.execute<CreateMetricCommand, void>(
      new CreateMetricCommand(body, user.id),
    );
  }
}
