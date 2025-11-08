import {
  MUTATION_TOGGLE_EVENT_MARK,
  MUTATION_VISIT_EVENT,
  MUTATION_UPDATE_EVENT_ASSIGNEE,
  MUTATION_REMOVE_EVENT_ASSIGNEE,
  QUERY_EVENT,
  QUERY_EVENT_REPETITIONS_PORTION,
  QUERY_PROJECT_DAILY_EVENTS,
  QUERY_CHART_DATA,
  QUERY_EVENT_AI_SUGGESTION
} from './queries';
import * as api from '@/api';
import type {
  DailyEventsCursor,
  DailyEventsPortion,
  EventMark,
  EventsFilters,
  HawkEvent
} from '@/types/events';
import {
  EventsSortOrder
} from '@/types/events';
import type { User } from '@/types/user';
import type { EventChartItem } from '@/types/chart';
import type { APIResponse } from '../../types/api';

/**
 * Get specific event
 * @param projectId - event's project
 * @param eventId - id of the event
 * @param originalEventId - id of the original event
 * @returns
 */
export async function getEvent(projectId: string, eventId: string, originalEventId: string): Promise<HawkEvent | null> {
  const project = await (await api.callOld(QUERY_EVENT, {
    projectId,
    eventId,
    originalEventId,
  })).project;

  if (!project) {
    return null;
  }

  return project.event;
}

/**
 * Returns portion (list) of daily events with pointer to the first daily event of the next portion
 * @param projectId - id of the project
 * @param nextCursor - pointer to the next portion of daily events
 * @param sort - sort order for daily events
 * @param filters - filters for daily events
 * @param search - search string for daily events
 * @param release - release identifier to filter events
 */
export async function fetchDailyEventsPortion(
  projectId: string,
  nextCursor: DailyEventsCursor | null = null,
  sort = EventsSortOrder.ByDate,
  filters: EventsFilters = {},
  search = '',
  release?: string
): Promise<DailyEventsPortion> {
  const response = await api.call(QUERY_PROJECT_DAILY_EVENTS, {
    projectId,
    cursor: nextCursor,
    sort,
    filters,
    search,
    release,
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

  return project?.dailyEventsPortion ?? {
    cursor: null,
    dailyEventsPortion: [],
  };
}

/**
 * Fetches event's repetitions portion from project
 * @param projectId - project's identifier
 * @param originalEventId - id of the original event
 * @param limit - the number of repetitions
 * @param cursor - the cursor to fetch the next page of repetitions
 * @returns
 */
export async function getRepetitionsPortion(
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
}

/**
 * Mark event as visited for current user
 * @param projectId - project event related to
 * @param originalEventId — original event id of the visited one
 * @returns
 */
export async function visitEvent(projectId: string, originalEventId: string): Promise<boolean> {
  return (await api.callOld(MUTATION_VISIT_EVENT, {
    projectId,
    originalEventId,
  })).visitEvent;
}

/**
 * Set or unset mark to event
 * @param projectId - project event is related to
 * @param eventId — event Id
 * @param mark — mark to set
 */
export async function toggleEventMark(projectId: string, eventId: string, mark: EventMark): Promise<boolean> {
  return (await api.callOld(MUTATION_TOGGLE_EVENT_MARK, {
    projectId,
    eventId,
    mark,
  })).toggleEventMark;
}

/**
 * Fetch ask AI for an event
 * @param projectId - project event is related to
 * @param eventId - event to fetch ask AI for
 * @param originalEventId - id of the original event
 */
export async function fetchEventAiSuggestion(projectId: string, eventId: string, originalEventId: string): Promise<string> {
  const response = await api.call(QUERY_EVENT_AI_SUGGESTION, {
    projectId,
    eventId,
    originalEventId,
  });

  return response.data.project?.event?.aiSuggestion ?? '';
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
 * Fetch data for chart
 * @param projectId - project id
 * @param originalEventId - id of the original event
 * @param days - how many days we need to fetchfor displaying in chart
 * @param timezoneOffset - user's local timezone
 */
export async function fetchChartData(projectId: string, originalEventId: string, days: number, timezoneOffset: number): Promise<EventChartItem[]> {
  return (await api.callOld(QUERY_CHART_DATA, {
    projectId,
    originalEventId,
    days,
    timezoneOffset,
  })).project.event.chartData;
}
