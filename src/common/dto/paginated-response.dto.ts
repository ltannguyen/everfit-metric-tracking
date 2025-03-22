import { ApiProperty } from '@nestjs/swagger'

export class PaginatedApiResponseDto<T> {
  @ApiProperty({ example: 100 })
  skippedRecords: number

  @ApiProperty({ example: 1000 })
  totalRecords: number

  @ApiProperty({ isArray: true })
  data: T[]

  @ApiProperty({ example: 100 })
  payloadSize: number

  @ApiProperty({ example: true })
  hasNext: boolean
}
