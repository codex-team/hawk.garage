/**
 * Mock: getAllWorkspacesWithProjects
 *
 * Returns demo workspace with project and events
 */

import { DEMO_WORKSPACE, DEMO_PROJECTS, getDemoEventsByProjectId } from '@/api/mock-db';
import type { DailyEventsPortion, Workspace } from '@hawk.so/types';
import { MILLISECONDS_IN_DAY, MILLISECONDS_IN_SECOND, SECONDS_IN_DAY } from '@/utils/time';

/**
 * Create fresh daily events portion
 */
function createDailyEventsPortion(projectId: string): DailyEventsPortion {
  const now_seconds = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
  const dayTimestamp = Math.floor(now_seconds / SECONDS_IN_DAY) * SECONDS_IN_DAY;
  const projectEvents = getDemoEventsByProjectId(projectId);

  return {
    nextCursor: null,
    dailyEvents: projectEvents.map(event => ({
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
          projects: DEMO_PROJECTS.map((project) => ({
            ...project,
            dailyEventsPortion: createDailyEventsPortion(project.id),
          })),
        },
      ],
    },
    errors: [],
  };
}
