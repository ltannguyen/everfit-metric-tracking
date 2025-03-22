import { RequestUser } from '@common';
import { CreateMetricEndpoint } from '@modules/metric/application';
import {
  CreateMetricCommand,
  CreateMetricRequestBody,
} from '@modules/metric/application/command/createMetric';
import { CommandBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('CreateMetricEndpoint', () => {
  let commandBus: CommandBus;
  let endpoint: CreateMetricEndpoint;

  const requestBody: CreateMetricRequestBody = {
    date: '2025-01-01',
    value: 100,
    unit: 'meter',
  };

  const mockRequestUser: RequestUser = {
    id: 'b69b989c-789c-406e-8273-801d9a17bc4d',
  } as RequestUser;

  beforeEach(() => {
    commandBus = mock(CommandBus);
    endpoint = new CreateMetricEndpoint(instance(commandBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the CommandBus', async () => {
    when(
      commandBus.execute<CreateMetricCommand, void>(
        anyOfClass(CreateMetricCommand),
      ),
    ).thenResolve(undefined);

    expect.assertions(1);

    await expect(
      endpoint.create(mockRequestUser, requestBody),
    ).resolves.toBeUndefined();

    verify(commandBus.execute(anyOfClass(CreateMetricCommand))).once();
  });

  test('should throw error if the CommandBus throws', async () => {
    const error = instance(mock(Error));

    when(
      commandBus.execute<CreateMetricCommand, void>(
        anyOfClass(CreateMetricCommand),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(endpoint.create(mockRequestUser, requestBody)).rejects.toEqual(
      error,
    );

    verify(commandBus.execute(anyOfClass(CreateMetricCommand))).once();
  });
});
