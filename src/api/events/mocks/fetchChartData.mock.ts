import { DEMO_EVENTS } from '@/api/mock-db';
import type { ChartLine } from '@hawk.so/types';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_DAY = 24 * 60 * 60;

function alignToDay(timestamp: number, timezoneOffset = 0): number {
  const shiftedTimestamp = timestamp - timezoneOffset * SECONDS_IN_MINUTE;

  return Math.floor(shiftedTimestamp / SECONDS_IN_DAY) * SECONDS_IN_DAY + timezoneOffset * SECONDS_IN_MINUTE;
}

/**
 * Mock: fetchChartData (events)
 *
 * Returns chart data from mock-db
 */
export default function mockFetchChartData(
  _projectId: string,
  originalEventId: string,
  days = 14,
  timezoneOffset = 0
): ChartLine[] {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const fromTimestamp = nowSeconds - Math.max(1, days) * SECONDS_IN_DAY;
  const buckets = new Map<number, number>();

  for (let day = 0; day <= days; day++) {
    const dayTimestamp = alignToDay(fromTimestamp + day * SECONDS_IN_DAY, timezoneOffset);

    buckets.set(dayTimestamp, 0);
  }

  const anchorEvent = DEMO_EVENTS.find(event => event.originalEventId === originalEventId);

  const relatedEvents = DEMO_EVENTS.filter((event) => {
    if (event.timestamp < fromTimestamp || event.timestamp > nowSeconds) {
      return false;
    }

    if (event.originalEventId === originalEventId) {
      return true;
    }

    if (anchorEvent && event.payload.title === anchorEvent.payload.title) {
      return true;
    }

    return false;
  });

  relatedEvents.forEach((event) => {
    const dayBucket = alignToDay(event.timestamp, timezoneOffset);

    buckets.set(dayBucket, (buckets.get(dayBucket) || 0) + event.totalCount);
  });

  return [
    {
      label: 'accepted',
      data: Array.from(buckets.entries()).map(([timestamp, count]) => ({
        timestamp,
        count,
      })),
    },
  ];
}
