/**
 * Mock: getAllWorkspacesWithProjects
 *
 * Returns demo workspace with project and events
 */

import { DEMO_WORKSPACE, DEMO_PROJECT } from '@/api/mock-db';
import type { DailyEventsPortion } from '@/types/events';
import { DEMO_EVENTS } from '@/api/mock-db';
import { MILLISECONDS_IN_DAY } from '@/utils/time';
import type { Workspace } from '@/types/workspaces';

/**
 * Create fresh daily events portion
 */
function createDailyEventsPortion(): DailyEventsPortion {
  const now = Date.now();
  const dayTimestamp = Math.floor(now / MILLISECONDS_IN_DAY) * MILLISECONDS_IN_DAY;

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
