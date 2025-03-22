import { Pagination } from '@common';
import { ReplicaPrismaService } from '@db';
import { BadRequestException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';
import { GetMetricOrderByEnum } from '../../../metric.enum';
import { MetricService } from '../../../services';
import { GetMetricsQuery } from './getMetrics.query';
import { GetMetricsRequestQuery } from './getMetrics.request-query';
import { GetMetricsResponse } from './getMetrics.response';

@QueryHandler(GetMetricsQuery)
export class GetMetricsHandler
  implements IQueryHandler<GetMetricsQuery, GetMetricsResponse>
{
  private readonly logger = new Logger(GetMetricsHandler.name);

  constructor(
    private readonly dbContext: ReplicaPrismaService,
    private readonly metricService: MetricService,
  ) {}

  async execute(query: GetMetricsQuery) {
    const { skip, take } = query.option;
    const { total, data } = await this.getMetrics(query);

    this.logger.log('Get metrics');

    return Pagination.of(
      {
        skip,
        take,
      },
      total,
      data,
    );
  }

  private async getMetrics(query: GetMetricsQuery) {
    const { option, userId } = query;
    const {
      order = `${GetMetricOrderByEnum.DATE}:${Prisma.SortOrder.desc}`,
      skip = 0,
      take,
      unit,
    } = option;

    let [total, data] = await Promise.all([
      take === -1
        ? 0
        : this.dbContext.metric.count({
            where: this.getWhereConditions(option, userId),
          }),
      this.dbContext.metric.findMany({
        select: {
          id: true,
          type: true,
          date: true,
          values: {
            take: 1,
            where: _.isEmpty(unit) ? { isDefault: true } : { unit },
          },
        },
        skip,
        ...(take !== -1 && { take }),
        orderBy: this.getOrderBy(order),
        where: this.getWhereConditions(option, userId),
      }),
    ]);

    return {
      total: take === -1 ? data.length : total,
      data: data.map(({ values, date, ...metric }) => ({
        ...metric,
        date: dayjs.utc(date).format('YYYY-MM-DD'),
        value: values[0].value,
        unit: values[0].unit,
      })),
    };
  }

  private getWhereConditions(
    option: GetMetricsRequestQuery,
    userId?: string,
  ): Prisma.MetricWhereInput {
    const { from, to, onlyLastOfDate, type, unit } = option;

    if (!!type && !!unit && type !== this.metricService.getTypeByUnit(unit)) {
      throw new BadRequestException('Invalid type and unit combination');
    }

    return {
      ...(!_.isEmpty(userId) && { createdById: userId }),
      ...(!_.isEmpty(type) && { type }),
      ...(!_.isEmpty(from) &&
        _.isEmpty(to) && { date: { gte: dayjs.utc(from).toDate() } }),
      ...(!_.isEmpty(to) &&
        _.isEmpty(from) && { date: { lte: dayjs.utc(to).toDate() } }),
      ...(!_.isEmpty(from) &&
        !_.isEmpty(to) && {
          date: {
            gte: dayjs.utc(from).toDate(),
            lte: dayjs.utc(to).toDate(),
          },
        }),
      ...(onlyLastOfDate && { isLastOfDate: true }),
    };
  }

  private getOrderBy(order: string): Prisma.MetricOrderByWithRelationInput[] {
    const [field, direction] = order.split(':') as [
      GetMetricOrderByEnum,
      Prisma.SortOrder,
    ];

    return [{ [field]: direction }, { createdAt: Prisma.SortOrder.desc }];
  }
}
