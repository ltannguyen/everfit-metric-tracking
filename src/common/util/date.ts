import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function convertUTCDate(date: undefined): null;
export function convertUTCDate(date: string): Date;
export function convertUTCDate(date?: string) {
  return date ? dayjs.utc(date).toDate() : null;
}
