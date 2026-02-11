import { DEMO_EVENTS } from '@/api/mock-db';
import type { DailyEventsPortion } from '@hawk.so/types';
import { MILLISECONDS_IN_DAY, MILLISECONDS_IN_SECOND, SECONDS_IN_DAY } from '@/utils/time';

/**
 * Mock: fetchDailyEventsPortion
 *
 * Returns daily events portion using centralized demo events
 */
export default function mockFetchDailyEventsPortion(): DailyEventsPortion {
  const now_seconds = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
  const dayTimestamp = Math.floor(now_seconds / SECONDS_IN_DAY) * SECONDS_IN_DAY;

  return {
    nextCursor: null,
    dailyEvents: DEMO_EVENTS.map(event => ({
      id: `daily-${event.id}`,
      groupingTimestamp: dayTimestamp,
      count: event.totalCount,
      affectedUsers: event.usersAffected,
      event,
    })),
  };
}
