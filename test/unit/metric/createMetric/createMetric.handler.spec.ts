import { PrismaService } from '@db';
import { CreateMetricHandler } from '@modules/metric/application';
import { MetricService } from '@modules/metric/services';
import { Test } from '@nestjs/testing';

describe('CreateMetricHandler', () => {
  let dbContext: PrismaService;
  let handler: CreateMetricHandler;

  const mockPrismaService = {
    metric: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        CreateMetricHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        MetricService,
      ],
    }).compile();

    dbContext = module.get<PrismaService>(PrismaService);
    handler = module.get<CreateMetricHandler>(CreateMetricHandler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createMetric', () => {
    test('should safely create requested metric', async () => {
      dbContext.metric.updateMany = jest.fn();
      dbContext.metric.create = jest.fn();

      expect.assertions(3);

      await expect(
        handler.execute({
          body: {
            date: '2025-01-01',
            value: 100,
            unit: 'meter',
          },
          userId: 'b69b989c-789c-406e-8273-801d9a17bc4d',
        }),
      ).resolves.toBeUndefined();

      expect(dbContext.metric.updateMany).toHaveBeenCalledTimes(1);
      expect(dbContext.metric.create).toHaveBeenCalledTimes(1);
    });
  });
});
