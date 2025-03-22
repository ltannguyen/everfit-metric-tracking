import { PaginatedApiResponseDto } from '@common';

/**
 * Type of order direction
 */
export type OrderDirection = 'asc' | 'desc';

/**
 * Interface intended for requesting results paginated
 */
export interface PaginationRequest {
  // Number of records to skip (where the pagination shall start)
  skip?: number;

  // Number of records to take
  take?: number;

  // Sort orders
  order?: { [field: string]: OrderDirection };

  // Other params of type T
  params?: any;
}

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest}
   * @param totalRecords {number}
   * @param dtos {t[]}
   * @returns {PaginatedApiResponseDto}
   */
  static of<T>(
    { take, skip }: PaginationRequest,
    totalRecords: number,
    dtos: T[],
  ): PaginatedApiResponseDto<T> {
    const hasNext = totalRecords > (skip ?? 0) + (take ?? 10);

    return {
      skippedRecords: skip ?? 0,
      totalRecords,
      data: dtos,
      payloadSize: dtos.length,
      hasNext,
    };
  }
}
