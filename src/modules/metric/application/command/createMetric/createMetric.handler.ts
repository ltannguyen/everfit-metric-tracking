import { convertUTCDate } from '@common';
import { PrismaService } from '@db';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { $Enums } from '@prisma/client';
import { MetricService } from '../../../services';
import { CreateMetricCommand } from './createMetric.command';
import { CreateMetricRequestBody } from './createMetric.request-body';

@CommandHandler(CreateMetricCommand)
export class CreateMetricHandler
  implements ICommandHandler<CreateMetricCommand, void>
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly metricService: MetricService,
  ) {}

  async execute(command: CreateMetricCommand): Promise<void> {
    await this.createMetric(command.body, command.userId);
  }

  private async createMetric(
    body: CreateMetricRequestBody,
    userId: string,
  ): Promise<void> {
    const { date, unit, value } = body;
    const utcDate = convertUTCDate(date);

    const type = this.metricService.getTypeByUnit(unit);

    await this.dbContext.metric.updateMany({
      where: {
        date: utcDate,
        createdById: userId,
        type,
        isLastOfDate: true,
      },
      data: {
        isLastOfDate: false,
      },
    });

    const metricValues = this.metricService.getMetricValues(unit, value);

    const metric = await this.dbContext.metric.create({
      select: {
        id: true,
      },
      data: {
        date: utcDate,
        type,
        createdById: userId,
        values: {
          createMany: {
            data: metricValues,
          },
        },
        baseValue: metricValues.find((v) =>
          type === $Enums.MetricType.distance
            ? v.unit === $Enums.MetricUnit.meter
            : v.unit === $Enums.MetricUnit.celsius,
        )!.value,
      },
    });

    this.logger.log({ metric }, 'created metric record');
  }
}
