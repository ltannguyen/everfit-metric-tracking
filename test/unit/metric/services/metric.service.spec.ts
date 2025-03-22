import { MetricService } from '@modules/metric/services';
import { Test, TestingModule } from '@nestjs/testing';
import { $Enums } from '@prisma/client';
import _ from 'lodash';

describe('MetricService', () => {
  let metricService: MetricService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [MetricService],
    }).compile();

    metricService = module.get<MetricService>(MetricService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMetricValues', () => {
    test('should calculated correct value', async () => {
      expect(
        _.sortBy(
          metricService.getMetricValues($Enums.MetricUnit.meter, 1),
          'unit',
        ).map((metric) => ({
          unit: metric.unit,
          value: metric.value,
          isDefault: metric.isDefault,
        })),
      ).toEqual(
        _.sortBy(
          [
            {
              unit: $Enums.MetricUnit.meter,
              value: 1,
              isDefault: true,
            },
            {
              unit: $Enums.MetricUnit.centimeter,
              value: 100,
              isDefault: false,
            },
            {
              unit: $Enums.MetricUnit.inch,
              value: 39.3701,
              isDefault: false,
            },
            {
              unit: $Enums.MetricUnit.feet,
              value: 3.28084,
              isDefault: false,
            },
            {
              unit: $Enums.MetricUnit.yard,
              value: 1.09361,
              isDefault: false,
            },
          ],
          'unit',
        ),
      );
    });
  });

  describe('getTypeByUnit', () => {
    test('should get correct type', async () => {
      expect(metricService.getTypeByUnit($Enums.MetricUnit.meter)).toEqual(
        $Enums.MetricType.distance,
      );
    });
  });
});
