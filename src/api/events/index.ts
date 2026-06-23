import {
  MUTATION_TOGGLE_EVENT_MARK,
  MUTATION_BULK_SET_EVENT_MARKS,
  MUTATION_BULK_VISIT_EVENTS,
  MUTATION_VISIT_EVENT,
  MUTATION_UPDATE_EVENT_ASSIGNEE,
  MUTATION_REMOVE_EVENT_ASSIGNEE,
  MUTATION_BULK_UPDATE_EVENT_ASSIGNEE,
  QUERY_EVENT,
  QUERY_EVENT_REPETITIONS_PORTION,
  QUERY_PROJECT_DAILY_EVENTS,
  QUERY_CHART_DATA,
  MUTATION_REMOVE_EVENT
} from './queries';
import * as api from '@/api';
import type {
  DailyEventsCursor,
  DailyEventsPortion,
  EventMark,
  EventsFilters,
  HawkEvent
} from '@/types/events';
import type { BulkEventsMutationResult } from '@/types/bulk';
import {
  EventsSortOrder
} from '@/types/events';
import type { User } from '@/types/user';
import type { ChartLine } from '@/types/chart';
import type { APIResponse } from '../../types/api';
import { withDemoMock } from '@/utils/withDemoMock';

/**
 * Execute bulk GraphQL mutation with soft-error handling.
 * Returns null when API responds with GraphQL errors or without data.
 * @param query GraphQL mutation document
 * @param variables Mutation variables
 * @param pickResult Selector extracting mutation result payload from response data
 */
async function runBulkMutation<TResponse>(
  query: string,
  variables: Record<string, unknown>,
  pickResult: (response: TResponse) => BulkEventsMutationResult | null | undefined
): Promise<BulkEventsMutationResult | null> {
  const response = await api.call<TResponse>(query, variables, undefined, { allowErrors: true });

  if (response.errors?.length) {
    return null;
  }

  if (!response.data) {
    return null;
  }

  return pickResult(response.data) ?? null;
}

/**
 * Get specific event
 * @param projectId - event's project
 * @param eventId - id of the event
 * @param originalEventId - id of the original event
 * @returns
 */
export const getEvent = withDemoMock(
  async function getEvent(projectId: string, eventId: string, originalEventId: string): Promise<HawkEvent | null> {
    const project = await (await api.callOld(QUERY_EVENT, {
      projectId,
      eventId,
      originalEventId,
    })).project;

    if (!project) {
      return null;
    }

    return project.event;
  },
  '/src/api/events/mocks/getEvent.mock.ts'
);

/**
 * Returns portion (list) of daily events with pointer to the first daily event of the next portion
 * @param projectId - id of the project
 * @param nextCursor - pointer to the next portion of daily events
 * @param sort - sort order for daily events
 * @param filters - filters for daily events
 * @param search - search string for daily events
 * @param release - release identifier to filter events
 * @param assignee - user id to filter events by assignee
 */
export const fetchDailyEventsPortion = withDemoMock(
  async function fetchDailyEventsPortion(
    projectId: string,
    nextCursor: DailyEventsCursor | null = null,
    sort = EventsSortOrder.ByDate,
    filters: EventsFilters = {},
    search = '',
    release?: string,
    assignee?: string
  ): Promise<DailyEventsPortion> {
    const response = await api.call(QUERY_PROJECT_DAILY_EVENTS, {
      projectId,
      cursor: nextCursor,
      sort,
      filters,
      search,
      release,
      assignee,
    }, undefined, {
    /**
     * This request calls on the app start, so we don't want to break app if something goes wrong
     * With this flag, errors from the API won't be thrown, but returned in the response for further handling
     */
      allowErrors: true,
    });

    const project = response.data.project;

    if (response.errors?.length) {
      response.errors.forEach(e => console.error(e));
    }

    return project?.dailyEventsPortion ?? { nextCursor: null,
      dailyEvents: [] };
  },
  '/src/api/events/mocks/fetchDailyEventsPortion.mock.ts'
);

/**
 * Fetches event's repetitions portion from project
 * @param projectId - project's identifier
 * @param originalEventId - id of the original event
 * @param limit - the number of repetitions
 * @param cursor - the cursor to fetch the next page of repetitions
 * @returns
 */
export const getRepetitionsPortion = withDemoMock(
  async function getRepetitionsPortion(
    projectId: string, originalEventId: string, limit: number, cursor?: string
  ): Promise<APIResponse<{ project: { event: { repetitionsPortion: { repetitions: HawkEvent[];
    nextCursor?: string; }; }; }; }>> {
    const response = await api.call(QUERY_EVENT_REPETITIONS_PORTION, {
      limit,
      projectId,
      originalEventId,
      cursor,
    }, undefined, {
    /**
     * This request calls on the app start, so we don't want to break app if something goes wrong
     * With this flag, errors from the API won't be thrown, but returned in the response for further handling
     */
      allowErrors: true,
    });

    if (response.errors?.length) {
      response.errors.forEach(e => console.error(e));
    }

    return response;
  },
  '/src/api/events/mocks/getRepetitionsPortion.mock.ts'
);

/**
 * Mark event as visited for current user
 * @param projectId - project event related to
 * @param originalEventId — original event id of the visited one
 * @returns
 */
export const visitEvent = withDemoMock(
  async function visitEvent(projectId: string, originalEventId: string): Promise<boolean> {
    return (await api.callOld(MUTATION_VISIT_EVENT, {
      projectId,
      originalEventId,
    })).visitEvent;
  },
  '/src/api/events/mocks/visitEvent.mock.ts'
);

/**
 * Mark many original events as visited for current user
 * @param projectId - project id
 * @param eventIds - original event ids
 */
export async function bulkVisitEvents(
  projectId: string,
  eventIds: string[]
): Promise<BulkEventsMutationResult | null> {
  return runBulkMutation<{
    bulkVisitEvents: {
      success: boolean;
      modifiedCount: number;
    };
  }>(
    MUTATION_BULK_VISIT_EVENTS,
    {
      projectId,
      eventIds,
    },
    data => data.bulkVisitEvents
  );
}

/**
 * Set or unset mark to event
 * @param projectId - project event is related to
 * @param eventId — event Id
 * @param mark — mark to set
 */
export const toggleEventMark = withDemoMock(
  async function toggleEventMark(projectId: string, eventId: string, mark: EventMark): Promise<boolean> {
    return (await api.callOld(MUTATION_TOGGLE_EVENT_MARK, {
      projectId,
      eventId,
      mark,
    })).toggleEventMark;
  },
  '/src/api/events/mocks/toggleEventMark.mock.ts'
);

/**
 * Bulk set/clear marks (original event ids)
 * @param projectId - project id
 * @param eventIds - original event ids
 * @param mark - resolved, ignored or starred
 * @param enabled - true to set mark, false to clear mark
 */
export async function bulkSetEventMarks(
  projectId: string,
  eventIds: string[],
  mark: 'resolved' | 'ignored' | 'starred',
  enabled: boolean
): Promise<BulkEventsMutationResult | null> {
  return runBulkMutation<{
    bulkSetEventMarks: {
      success: boolean;
      modifiedCount: number;
    };
  }>(
    MUTATION_BULK_SET_EVENT_MARKS,
    {
      projectId,
      eventIds,
      mark,
      enabled,
    },
    data => data.bulkSetEventMarks
  );
}

/**
 * Update assignee
 * @param projectId - project id
 * @param eventId - original event id
 * @param assignee - user id to assign
 */
export async function updateAssignee(projectId: string, eventId: string, assignee: string): Promise<{ success: boolean;
  record: User; }> {
  return (await api.callOld(MUTATION_UPDATE_EVENT_ASSIGNEE, {
    input: {
      projectId,
      eventId,
      assignee,
    },
  })).events.updateAssignee;
}

/**
 * Remove assignee
 * @param projectId - project id
 * @param eventId - event id
 */
export async function removeAssignee(projectId: string, eventId: string): Promise<{ success: boolean }> {
  return (await api.callOld(MUTATION_REMOVE_EVENT_ASSIGNEE, {
    input: {
      projectId,
      eventId,
    },
  })).events.removeAssignee;
}

/**
 * Bulk set/clear assignee for original event ids
 * @param projectId - project id
 * @param eventIds - original event ids
 * @param assigneeId - user id to assign, null to clear
 */
export async function bulkUpdateAssignee(
  projectId: string,
  eventIds: string[],
  assigneeId: string | null
): Promise<BulkEventsMutationResult | null> {
  return runBulkMutation<{
    events: {
      bulkUpdateAssignee: {
        success: boolean;
        modifiedCount: number;
      };
    };
  }>(
    MUTATION_BULK_UPDATE_EVENT_ASSIGNEE,
    {
      input: {
        projectId,
        eventIds,
        assignee: assigneeId,
      },
    },
    data => data.events.bulkUpdateAssignee
  );
}

/**
 * Fetch data for event daily chart
 * @param projectId - id of the project owning the event
 * @param originalEventId - id of the original event
 * @param days - how many days we need to fetch for displaying in chart
 * @param timezoneOffset - user's local timezone
 */
export const fetchChartData = withDemoMock(
  async function fetchChartData(
    projectId: string,
    originalEventId: string,
    days: number,
    timezoneOffset: number
  ): Promise<ChartLine[]> {
    return (await api.callOld(QUERY_CHART_DATA, {
      projectId,
      originalEventId,
      days,
      timezoneOffset,
    })).project.event.chartData;
  },
  '/src/api/events/mocks/fetchChartData.mock.ts'
);

/**
 * Remove event and all related data (repetitions, daily events)
 * @param projectId - project event is related to
 * @param eventId — original event id to remove
 */
export async function removeEvent(projectId: string, eventId: string): Promise<APIResponse<{ removeEvent: boolean }>> {
  return await api.call<{ removeEvent: boolean }>(MUTATION_REMOVE_EVENT, {
    projectId,
    eventId,
  }, undefined, {
    allowErrors: true,
  });
}
