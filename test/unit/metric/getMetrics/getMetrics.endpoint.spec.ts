import { RequestUser } from '@common';
import { GetMetricsEndpoint } from '@modules/metric/application';
import {
  GetMetricsQuery,
  GetMetricsRequestQuery,
  GetMetricsResponse,
} from '@modules/metric/application/queries/getMetrics';
import { QueryBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

const mockRequestUser: RequestUser = {
  id: 'b69b989c-789c-406e-8273-801d9a17bc4d',
};

describe('GetMetricsEndpoint', () => {
  let mockQueryBus: QueryBus;
  let endpoint: GetMetricsEndpoint;

  beforeEach(() => {
    mockQueryBus = mock(QueryBus);
    endpoint = new GetMetricsEndpoint(instance(mockQueryBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the QueryBus', async () => {
    const response = instance(mock(GetMetricsResponse));

    when(
      mockQueryBus.execute<GetMetricsQuery, GetMetricsResponse>(
        anyOfClass(GetMetricsQuery),
      ),
    ).thenResolve(response);

    expect.assertions(1);

    await expect(
      endpoint.get(anyOfClass(GetMetricsRequestQuery), mockRequestUser),
    ).resolves.toStrictEqual(response);

    verify(mockQueryBus.execute(anyOfClass(GetMetricsQuery))).once();
  });

  test('should throw error if the QueryBus throws', async () => {
    const error = instance(mock(Error));

    when(
      mockQueryBus.execute<GetMetricsQuery, GetMetricsResponse>(
        anyOfClass(GetMetricsQuery),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      endpoint.get(anyOfClass(GetMetricsRequestQuery), mockRequestUser),
    ).rejects.toEqual(error);

    verify(mockQueryBus.execute(anyOfClass(GetMetricsQuery))).once();
  });
});
