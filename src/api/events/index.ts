import {
  MUTATION_TOGGLE_EVENT_MARK,
  MUTATION_VISIT_EVENT,
  MUTATION_UPDATE_EVENT_ASSIGNEE,
  MUTATION_REMOVE_EVENT_ASSIGNEE,
  QUERY_EVENT,
  QUERY_EVENT_REPETITIONS_PORTION,
  QUERY_PROJECT_DAILY_EVENTS,
  QUERY_CHART_DATA
} from './queries';
import * as api from '@/api';
import {
  DailyEventsPortion,
  EventMark,
  EventsFilters,
  EventsSortOrder,
  EventsWithDailyInfo,
  HawkEvent
} from '@/types/events';
import { User } from '@/types/user';
import { EventChartItem } from '@/types/chart';
import { APIResponse } from '../../types/api';

/**
 * Get specific event
 *
 * @param {string} projectId - event's project
 * @param {string} eventId - id of the event
 * @param {string} originalEventId - id of the original event
 * @returns {Promise<HawkEvent|null>}
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
 *
 * @param projectId - id of the project
 * @param nextCursor - pointer to the next portion of daily events
 * @param sort - sort order for daily events
 * @param filters - filters for daily events
 * @param search - search string for daily events
 */
export async function fetchDailyEventsPortion(
  projectId: string,
  nextCursor: string | null = null,
  sort = EventsSortOrder.ByDate,
  filters: EventsFilters = {},
  search = ''
): Promise<DailyEventsPortion> {
  const response = await api.call(QUERY_PROJECT_DAILY_EVENTS, {
    projectId,
    cursor: nextCursor,
    sort,
    filters,
    search,
  });

  const project = response.data.project;

  if (response.errors?.length) {
    response.errors.forEach(e => console.error(e));
  }

  return project?.dailyEventsPortion ?? { cursor: null,
    dailyEventsPortion: [] };
}

/**
 * Fetches event's repetitions portion from project
 *
 * @param {string} projectId - project's identifier
 * @param {string} eventId - event's identifier
 * @param {string} originalEventId - id of the original event
 * @param {number} limit - the number of repetitions
 * @param {string} cursor - the cursor to fetch the next page of repetitions
 *
 * @returns {Promise<Event[]>}
 */
export async function getRepetitionsPortion(
  projectId: string, originalEventId: string, limit: number, cursor?: string
): Promise<APIResponse<{project: { event: { repetitionsPortion: { repetitions: HawkEvent[], nextCursor?: string } } } }>> {
  const response = await api.call(QUERY_EVENT_REPETITIONS_PORTION, {
    limit,
    projectId,
    originalEventId,
    cursor,
  });

  if (response.errors?.length) {
    response.errors.forEach(e => console.error(e));
  }

  return response
}

/**
 * Mark event as visited for current user
 *
 * @param {string} projectId - project event related to
 * @param {string} eventId — visited event
 * @returns {Promise<boolean>}
 */
export async function visitEvent(projectId: string, eventId: string): Promise<boolean> {
  return (await api.callOld(MUTATION_VISIT_EVENT, {
    projectId,
    eventId,
  })).visitEvent;
}

/**
 * Set or unset mark to event
 *
 * @param {string} projectId - project event is related to
 * @param {string} eventId — event Id
 * @param {string} mark — mark to set
 */
export async function toggleEventMark(projectId: string, eventId: string, mark: EventMark): Promise<boolean> {
  return (await api.callOld(MUTATION_TOGGLE_EVENT_MARK, {
    projectId,
    eventId,
    mark,
  })).toggleEventMark;
}

/**
 * Update assignee
 *
 * @param {string} projectId - project id
 * @param {string} eventId - event id
 * @param {string} assignee - user id to assign
 */
export async function updateAssignee(projectId: string, eventId: string, assignee: string): Promise<{ success: boolean; record: User }> {
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
 *
 * @param {string} projectId - project id
 * @param {string} eventId - event id
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
 *
 * @param {string} projectId - project id
 * @param {string} originalEventId - id of the original event
 * @param {number} days - how many days we need to fetchfor displaying in chart
 * @param {number} timezoneOffset - user's local timezone
 */
export async function fetchChartData(projectId: string, originalEventId: string, days: number, timezoneOffset: number): Promise<EventChartItem[]> {
  return (await api.callOld(QUERY_CHART_DATA, {
    projectId,
    originalEventId,
    days,
    timezoneOffset,
  })).project.event.chartData;
}
