import { getDemoEventsByProjectId } from '@/api/mock-db';
import type { DailyEventsPortion } from '@hawk.so/types';
import { MILLISECONDS_IN_SECOND, SECONDS_IN_DAY } from '@/utils/time';
import { EventsSortOrder, type EventsFilters } from '@/types/events';

/**
 * Mock: fetchDailyEventsPortion
 *
 * Returns daily events portion using centralized demo events
 */
export default function mockFetchDailyEventsPortion(
  projectId?: string,
  _nextCursor: unknown = null,
  sort = EventsSortOrder.ByDate,
  filters: EventsFilters = {},
  search = ''
): DailyEventsPortion {
  const now_seconds = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
  const dayTimestamp = Math.floor(now_seconds / SECONDS_IN_DAY) * SECONDS_IN_DAY;

  const normalizedSearch = String(search || '').trim().toLowerCase();

  const filteredEvents = getDemoEventsByProjectId(projectId)
    .filter((event) => {
      if (typeof filters.starred === 'boolean' && event.marks.starred !== filters.starred) {
        return false;
      }

      if (typeof filters.resolved === 'boolean' && event.marks.resolved !== filters.resolved) {
        return false;
      }

      if (typeof filters.ignored === 'boolean' && event.marks.ignored !== filters.ignored) {
        return false;
      }

      if (normalizedSearch && !event.payload.title.toLowerCase().includes(normalizedSearch)) {
        return false;
      }

      return true;
    })
    .sort((first, second) => {
      if (sort === EventsSortOrder.ByCount) {
        return second.totalCount - first.totalCount;
      }

      if (sort === EventsSortOrder.ByAffectedUsers) {
        return second.usersAffected - first.usersAffected;
      }

      return second.timestamp - first.timestamp;
    });

  return {
    nextCursor: null,
    dailyEvents: filteredEvents.map(event => ({
      id: `daily-${event.id}`,
      groupingTimestamp: dayTimestamp,
      count: event.totalCount,
      affectedUsers: event.usersAffected,
      event,
    })),
  };
}
