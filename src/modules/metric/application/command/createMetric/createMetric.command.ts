import { CreateMetricRequestBody } from './createMetric.request-body';

export class CreateMetricCommand {
  constructor(
    public readonly body: CreateMetricRequestBody,
    public readonly userId: string,
  ) {}
}
