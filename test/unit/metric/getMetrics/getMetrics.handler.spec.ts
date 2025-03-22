import { ReplicaPrismaService } from '@db';
import { GetMetricsHandler } from '@modules/metric/application';
import { GetMetricsQuery } from '@modules/metric/application/queries/getMetrics';
import { MetricService } from '@modules/metric/services';
import { Test, TestingModule } from '@nestjs/testing';

describe('GetMetricHandler', () => {
  let handler: GetMetricsHandler;
  let dbContext: ReplicaPrismaService;

  const mockFindManyMetrics = [
    {
      id: 'e3a8dda4-ea0e-460e-a7a8-bb91207db977',
      type: 'distance',
      date: '2025-01-01',
      values: [
        {
          value: 100,
          unit: 'meter',
        },
      ],
      unit: 'meter',
    },
  ];

  const mockPrismaService = {
    metric: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        GetMetricsHandler,
        MetricService,
        {
          provide: ReplicaPrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    handler = module.get<GetMetricsHandler>(GetMetricsHandler);
    dbContext = module.get<ReplicaPrismaService>(ReplicaPrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should safely get metrics', async () => {
      dbContext.metric.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyMetrics);
      dbContext.metric.count = jest
        .fn()
        .mockResolvedValue(mockFindManyMetrics.length);

      await expect(
        handler.execute(
          new GetMetricsQuery({
            order: 'date:desc',
            skip: 0,
            take: 10,
          }),
        ),
      ).resolves.toEqual({
        hasNext: expect.any(Boolean),
        payloadSize: expect.any(Number),
        skippedRecords: expect.any(Number),
        totalRecords: expect.any(Number),
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            date: expect.any(String),
            value: expect.any(Number),
            unit: expect.any(String),
          }),
        ]),
      });

      expect(dbContext.metric.findMany).toHaveBeenCalledTimes(1);
      expect(dbContext.metric.count).toHaveBeenCalledTimes(1);
    });

    test('should safely get metrics with full filter', async () => {
      dbContext.metric.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyMetrics);
      dbContext.metric.count = jest
        .fn()
        .mockResolvedValue(mockFindManyMetrics.length);

      await expect(
        handler.execute(
          new GetMetricsQuery({
            order: 'date:desc',
            from: '2025-01-01',
            onlyLastOfDate: true,
            to: '2025-01-01',
            type: 'distance',
            unit: 'meter',
            take: -1,
          }),
        ),
      ).resolves.toEqual({
        hasNext: expect.any(Boolean),
        payloadSize: expect.any(Number),
        skippedRecords: expect.any(Number),
        totalRecords: expect.any(Number),
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            date: expect.any(String),
            value: expect.any(Number),
            unit: expect.any(String),
          }),
        ]),
      });

      expect(dbContext.metric.findMany).toHaveBeenCalledTimes(1);
      expect(dbContext.metric.count).toHaveBeenCalledTimes(0);
    });
  });
});
