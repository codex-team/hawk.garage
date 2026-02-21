import { DEMO_EVENTS } from '@/api/mock-db';
import type { ChartLine } from '@hawk.so/types';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_DAY = 24 * 60 * 60;

function toUnixSeconds(value: string | number | undefined, fallback: number): number {
  if (typeof value === 'number') {
    return value > 1e12 ? Math.floor(value / 1000) : Math.floor(value);
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const numeric = Number(value);

    if (Number.isFinite(numeric)) {
      return numeric > 1e12 ? Math.floor(numeric / 1000) : Math.floor(numeric);
    }

    const parsed = Date.parse(value);

    if (!Number.isNaN(parsed)) {
      return Math.floor(parsed / 1000);
    }
  }

  return fallback;
}

function getBucketStart(timestamp: number, bucketSizeSeconds: number, timezoneOffset = 0): number {
  const shiftedTimestamp = timestamp - timezoneOffset * SECONDS_IN_MINUTE;

  return Math.floor(shiftedTimestamp / bucketSizeSeconds) * bucketSizeSeconds + timezoneOffset * SECONDS_IN_MINUTE;
}

function isRateLimitedEvent(event: { payload?: { type?: string; title?: string } }): boolean {
  const type = event.payload?.type?.toLowerCase() || '';
  const title = event.payload?.title?.toLowerCase() || '';

  return type.includes('ratelimit') || title.includes('rate limit') || title.includes('rate-limit');
}

/**
 * Mock: fetchChartData (projects)
 *
 * Returns chart data for project overview from mock-db
 */
export default function mockFetchChartData(
  _projectId: string,
  startDate: string,
  endDate: string,
  groupBy: number,
  timezoneOffset = 0
): {
  data: { project: { chartData: ChartLine[] } };
  errors: unknown[];
} {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const safeGroupBy = Math.max(1, Number(groupBy) || 60);
  const bucketSizeSeconds = safeGroupBy * SECONDS_IN_MINUTE;
  const startTimestamp = toUnixSeconds(startDate, nowSeconds - SECONDS_IN_DAY);
  const endTimestamp = toUnixSeconds(endDate, nowSeconds);

  if (startTimestamp > endTimestamp) {
    return {
      data: {
        project: {
          chartData: [
            {
              label: 'accepted',
              data: [],
            },
            {
              label: 'rate-limited',
              data: [],
            },
          ],
        },
      },
      errors: [],
    };
  }

  const firstBucket = getBucketStart(startTimestamp, bucketSizeSeconds, timezoneOffset);
  const lastBucket = getBucketStart(endTimestamp, bucketSizeSeconds, timezoneOffset);
  const acceptedByBucket = new Map<number, number>();
  const rateLimitedByBucket = new Map<number, number>();

  for (let bucket = firstBucket; bucket <= lastBucket; bucket += bucketSizeSeconds) {
    acceptedByBucket.set(bucket, 0);
    rateLimitedByBucket.set(bucket, 0);
  }

  const eventsInRange = DEMO_EVENTS.filter(event =>
    event.timestamp >= startTimestamp && event.timestamp <= endTimestamp
  );

  eventsInRange.forEach(event => {
    const bucket = getBucketStart(event.timestamp, bucketSizeSeconds, timezoneOffset);

    if (!acceptedByBucket.has(bucket)) {
      return;
    }

    const acceptedCount = acceptedByBucket.get(bucket) || 0;

    acceptedByBucket.set(bucket, acceptedCount + event.totalCount);

    if (isRateLimitedEvent(event)) {
      const rateLimitedCount = rateLimitedByBucket.get(bucket) || 0;

      rateLimitedByBucket.set(bucket, rateLimitedCount + event.totalCount);
    }
  });

  const acceptedLine = Array.from(acceptedByBucket.entries()).map(([timestamp, count]) => ({
    timestamp,
    count,
  }));
  const rateLimitedLine = Array.from(rateLimitedByBucket.entries()).map(([timestamp, count]) => ({
    timestamp,
    count,
  }));

  return {
    data: {
      project: {
        chartData: [
          {
            label: 'accepted',
            data: acceptedLine,
          },
          {
            label: 'rate-limited',
            data: rateLimitedLine,
          },
        ],
      },
    },
    errors: [],
  };
}
