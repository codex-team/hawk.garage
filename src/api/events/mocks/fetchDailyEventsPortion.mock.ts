import { DEMO_EVENTS } from '@/api/mock-db';
import type { DailyEventsPortion } from '@/types/events';
import { MILLISECONDS_IN_DAY } from '@/utils/time';

/**
 * Mock: fetchDailyEventsPortion
 *
 * Returns daily events portion using centralized demo events
 */
export default function mockFetchDailyEventsPortion(): DailyEventsPortion {
  const dayTimestamp = Math.floor(Date.now() / MILLISECONDS_IN_DAY) * MILLISECONDS_IN_DAY;

  return {
    nextCursor: null,
    dailyEvents: DEMO_EVENTS.map((event) => ({
      id: `daily-${event.id}`,
      groupingTimestamp: dayTimestamp,
      count: event.totalCount,
      affectedUsers: event.usersAffected,
      event,
    })),
  };
}
