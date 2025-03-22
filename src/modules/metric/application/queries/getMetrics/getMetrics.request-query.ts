import { IsOrderQueryParam } from '@common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';
import { GetMetricOrderByEnum } from '../../../metric.enum';

export class GetMetricsRequestQuery {
  @ApiPropertyOptional({
    description: `Filter by metric type. \n\n  Available values: ${Object.values(
      $Enums.MetricType,
    ).join(', ')}`,
    example: $Enums.MetricType.distance,
  })
  @IsOptional()
  @IsEnum($Enums.MetricType)
  @ValidateIf((o) => !!o.type)
  type?: $Enums.MetricType;

  @ApiPropertyOptional({
    description: `Filter by metric unit. \n\n  Available values: ${Object.values(
      $Enums.MetricUnit,
    ).join(', ')}`,
    example: $Enums.MetricUnit.meter,
  })
  @IsOptional()
  @IsEnum($Enums.MetricUnit)
  unit?: $Enums.MetricUnit;

  @ApiPropertyOptional({
    description: 'Filter by is last of date',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  onlyLastOfDate?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by date. Format: YYYY-MM-DD',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter by date. Format: YYYY-MM-DD',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  to?: string;

  @ApiProperty({
    description: 'Number of records to skip and then return the remainder',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({
    description:
      'Number of records to return and then skip over the remainder. -1 means no limit',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(-1)
  take?: number;

  @ApiPropertyOptional({
    description: `Order by keyword. \n\n  Available values: ${Object.values(
      GetMetricOrderByEnum,
    ).join(', ')}`,
    example: `${GetMetricOrderByEnum.DATE}:${Prisma.SortOrder.desc}`,
  })
  @IsString()
  @IsOptional()
  @IsOrderQueryParam('order', GetMetricOrderByEnum)
  order?: string;
}
