import { PaginatedApiResponseDto } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class GetMetricResponse {}

export class GetMetricsResponse extends PaginatedApiResponseDto<GetMetricResponse> {
  @ApiProperty({
    description: 'Audit log response array object',
    type: [GetMetricResponse],
  })
  data: GetMetricResponse[];
}
