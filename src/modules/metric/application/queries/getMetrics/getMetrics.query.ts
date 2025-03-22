import { GetMetricsRequestQuery } from './getMetrics.request-query';

export class GetMetricsQuery {
  constructor(
    public readonly option: GetMetricsRequestQuery,
    public readonly userId?: string,
  ) {}
}
