import { DEMO_EVENTS } from '@/api/mock-db';
import type { DailyEventsPortion } from '@/types/events';

/**
 * Mock: fetchDailyEventsPortion
 *
 * Returns daily events portion using centralized demo events
 */
export default function mockFetchDailyEventsPortion(): DailyEventsPortion {
  const dayTimestamp = Math.floor(Date.now() / 86400000) * 86400000;

  return {
    nextCursor: null,
    dailyEvents: DEMO_EVENTS.map((event, index) => ({
      id: `daily-${event.id}`,
      groupingTimestamp: dayTimestamp,
      count: event.totalCount,
      affectedUsers: event.usersAffected,
      event,
    })),
  };
}
