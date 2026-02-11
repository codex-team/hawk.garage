/**
 * Mock: getAllWorkspacesWithProjects
 *
 * Returns demo workspace with project and events
 */

import { DEMO_WORKSPACE, DEMO_PROJECT } from '@/api/mock-db';
import type { DailyEventsPortion } from '@/types/events';
import { DEMO_EVENTS } from '@/api/mock-db';

/**
 * Create fresh daily events portion
 */
function createDailyEventsPortion(): DailyEventsPortion {
  const now = Date.now();
  const dayTimestamp = Math.floor(now / 86400000) * 86400000;

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

export default function mockGetAllWorkspacesWithProjects() {
  return {
    data: {
      workspaces: [
        {
          ...DEMO_WORKSPACE,
          projects: [
            {
              ...DEMO_PROJECT,
              dailyEventsPortion: createDailyEventsPortion(),
            },
          ],
        },
      ],
    },
    errors: [],
  };
}
