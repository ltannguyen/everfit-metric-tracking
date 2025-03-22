import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';

@Injectable()
export class MetricService {
  private readonly unitTable = {
    [$Enums.MetricType.distance]: [
      $Enums.MetricUnit.meter,
      $Enums.MetricUnit.centimeter,
      $Enums.MetricUnit.inch,
      $Enums.MetricUnit.feet,
      $Enums.MetricUnit.yard,
    ],
    [$Enums.MetricType.temperature]: [
      $Enums.MetricUnit.celsius,
      $Enums.MetricUnit.fahrenheit,
      $Enums.MetricUnit.kelvin,
    ],
  };
  private readonly conversionTable = {
    [$Enums.MetricUnit.meter]: {
      [$Enums.MetricUnit.meter]: (value: number) => value,
      [$Enums.MetricUnit.centimeter]: (value: number) => value * 100,
      [$Enums.MetricUnit.inch]: (value: number) => value * 39.3701,
      [$Enums.MetricUnit.feet]: (value: number) => value * 3.28084,
      [$Enums.MetricUnit.yard]: (value: number) => value * 1.09361,
    },
    [$Enums.MetricUnit.centimeter]: {
      [$Enums.MetricUnit.centimeter]: (value: number) => value,
      [$Enums.MetricUnit.meter]: (value: number) => value / 100,
      [$Enums.MetricUnit.inch]: (value: number) => value / 2.54,
      [$Enums.MetricUnit.feet]: (value: number) => value / 30.48,
      [$Enums.MetricUnit.yard]: (value: number) => value / 91.44,
    },
    [$Enums.MetricUnit.inch]: {
      [$Enums.MetricUnit.inch]: (value: number) => value,
      [$Enums.MetricUnit.meter]: (value: number) => value / 39.3701,
      [$Enums.MetricUnit.centimeter]: (value: number) => value * 2.54,
      [$Enums.MetricUnit.feet]: (value: number) => value / 12,
      [$Enums.MetricUnit.yard]: (value: number) => value / 36,
    },
    [$Enums.MetricUnit.feet]: {
      [$Enums.MetricUnit.feet]: (value: number) => value,
      [$Enums.MetricUnit.meter]: (value: number) => value / 3.28084,
      [$Enums.MetricUnit.centimeter]: (value: number) => value * 30.48,
      [$Enums.MetricUnit.inch]: (value: number) => value * 12,
      [$Enums.MetricUnit.yard]: (value: number) => value / 3,
    },
    [$Enums.MetricUnit.yard]: {
      [$Enums.MetricUnit.yard]: (value: number) => value,
      [$Enums.MetricUnit.meter]: (value: number) => value / 1.09361,
      [$Enums.MetricUnit.centimeter]: (value: number) => value * 91.44,
      [$Enums.MetricUnit.inch]: (value: number) => value * 36,
      [$Enums.MetricUnit.feet]: (value: number) => value * 3,
    },
    [$Enums.MetricUnit.celsius]: {
      [$Enums.MetricUnit.celsius]: (value: number) => value,
      [$Enums.MetricUnit.fahrenheit]: (value: number) => (value * 9) / 5 + 32,
      [$Enums.MetricUnit.kelvin]: (value: number) => value + 273.15,
    },
    [$Enums.MetricUnit.fahrenheit]: {
      [$Enums.MetricUnit.fahrenheit]: (value: number) => value,
      [$Enums.MetricUnit.celsius]: (value: number) => ((value - 32) * 5) / 9,
      [$Enums.MetricUnit.kelvin]: (value: number) =>
        ((value - 32) * 5) / 9 + 273.15,
    },
    [$Enums.MetricUnit.kelvin]: {
      [$Enums.MetricUnit.kelvin]: (value: number) => value,
      [$Enums.MetricUnit.celsius]: (value: number) => value - 273.15,
      [$Enums.MetricUnit.fahrenheit]: (value: number) =>
        ((value - 273.15) * 9) / 5 + 32,
    },
  };

  getMetricValues(unit: $Enums.MetricUnit, value: number) {
    return Object.keys(this.conversionTable[unit]).map((key) => ({
      unit: key as $Enums.MetricUnit,
      value: this.conversionTable[unit][key](value) as number,
      isDefault: unit === key,
    }));
  }

  getTypeByUnit(unit: $Enums.MetricUnit): $Enums.MetricType {
    return Object.keys(this.unitTable).find((type: $Enums.MetricUnit) =>
      this.unitTable[type].includes(unit),
    ) as $Enums.MetricType;
  }
}
