/**
 * Mock: getAllWorkspacesWithProjects
 *
 * Returns demo workspace with project and events
 */

import { DEMO_WORKSPACE, DEMO_PROJECT } from '@/api/mock-db';
import type { DailyEventsPortion, Workspace } from '@hawk.so/types';
import { DEMO_EVENTS } from '@/api/mock-db';
import { MILLISECONDS_IN_DAY, MILLISECONDS_IN_SECOND, SECONDS_IN_DAY } from '@/utils/time';

/**
 * Create fresh daily events portion
 */
function createDailyEventsPortion(): DailyEventsPortion {
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

export default function mockGetAllWorkspacesWithProjects(): {
  data: { workspaces: Workspace[] };
  errors: unknown[];
} {
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
