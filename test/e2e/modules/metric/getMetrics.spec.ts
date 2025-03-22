import { ReplicaPrismaService } from '@db';
import { MetricModule } from '@modules';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('GetMetric', () => {
  let app: INestApplication;
  let server;

  const mockPrismaService = {
    metric: {
      findMany: () => [
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
      ],
      count: () => 0,
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MetricModule],
    })
      .overrideProvider(ReplicaPrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    server = app.getHttpServer();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  test('should safely return list of metrics', async () => {
    const res = await request(server).get('/metrics').expect(200);

    expect(res.body).toEqual({
      hasNext: expect.any(Boolean),
      payloadSize: expect.any(Number),
      totalRecords: expect.any(Number),
      skippedRecords: expect.any(Number),
      data: [
        {
          date: '2025-01-01',
          id: 'e3a8dda4-ea0e-460e-a7a8-bb91207db977',
          type: 'distance',
          unit: 'meter',
          value: 100,
        },
      ],
    });
  });
});
