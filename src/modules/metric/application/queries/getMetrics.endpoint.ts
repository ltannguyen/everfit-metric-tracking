import {
  PaginatedApiResponse,
  PaginatedApiResponseDto,
  RequestUser,
  ReqUser,
} from '@common';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetMetricResponse,
  GetMetricsQuery,
  GetMetricsRequestQuery,
  GetMetricsResponse,
} from './getMetrics';

@ApiTags('Metric')
@ApiHeader({
  name: 'x-user-id',
  example: 'b69b989c-789c-406e-8273-801d9a17bc4d',
  description: 'Leave it empty if you want to get metrics for all users',
})
@Controller({
  path: 'metrics',
  version: '1',
})
@UseInterceptors(PaginatedApiResponseDto)
export class GetMetricsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({
    description: 'Get metrics',
  })
  @PaginatedApiResponse(GetMetricResponse)
  @Get('')
  get(@Query() query: GetMetricsRequestQuery, @ReqUser() user: RequestUser) {
    return this.queryBus.execute<GetMetricsQuery, GetMetricsResponse>(
      new GetMetricsQuery(query, user.id),
    );
  }
}
