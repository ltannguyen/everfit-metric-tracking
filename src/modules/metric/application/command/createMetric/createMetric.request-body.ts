import { ApiProperty } from '@nestjs/swagger';
import { $Enums, MetricUnit } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, Matches } from 'class-validator';

export class CreateMetricRequestBody {
  @ApiProperty({
    description: 'Date',
    example: '2025-01-01',
  })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({
    description: 'Value',
    example: '100',
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Unit',
    example: $Enums.MetricUnit.meter,
  })
  @IsEnum($Enums.MetricUnit)
  unit: MetricUnit;
}
