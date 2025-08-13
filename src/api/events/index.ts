import {
  MUTATION_TOGGLE_EVENT_MARK,
  MUTATION_VISIT_EVENT,
  MUTATION_UPDATE_EVENT_ASSIGNEE,
  MUTATION_REMOVE_EVENT_ASSIGNEE,
  QUERY_EVENT,
  QUERY_LATEST_REPETITIONS,
  QUERY_PROJECT_OVERVIEW,
  QUERY_RECENT_PROJECT_EVENTS,
  QUERY_CHART_DATA
} from './queries';
import * as api from '@/api';
import {
  DailyEventsPortion,
  EventMark,
  EventsFilters,
  EventsSortOrder,
  EventsWithDailyInfo,
  HawkEvent,
  HawkEventRepetition
} from '@/types/events';
import { User } from '@/types/user';
import { EventChartItem } from '@/types/chart';
import NotFoundError from '../../errors/404';
import { APIResponse } from '../../types/api';

/**
 * Get specific event
 *
 * @param {string} projectId - event's project
 * @param {string} eventId - id of the event
 * @param {string} repetitionId - event's concrete repetition. This param is optional
 * @returns {Promise<HawkEvent|null>}
 */
export async function getEvent(projectId: string, eventId: string, repetitionId?: string): Promise<HawkEvent | null> {
  const project = await (await api.callOld(QUERY_EVENT, {
    projectId,
    eventId,
    repetitionId,
  })).project;

  if (!project) {
    return null;
  }

  return project.event;
}

/**
 * Returns latest project events
 *
 * @param {string} projectId - id of the project to fetch recent errors
 * @param {number} skip - certain number of documents to skip
 * @param {EventsSortOrder} sort - events sort order to use
 * @param {EventsFilters} filters - events filters to use
 * @param search
 * @throws Error - 404 when project id is incorrect
 * @returns {Promise<EventsWithDailyInfo|null>}
 */
export async function fetchRecentEvents(
  projectId: string,
  skip = 0,
  sort = EventsSortOrder.ByDate,
  filters: EventsFilters = {},
  search = ''
): Promise<EventsWithDailyInfo | null> {
  const project = (await api.callOld(QUERY_RECENT_PROJECT_EVENTS, {
    projectId,
    skip,
    sort,
    filters,
    search,
  })).project;

  if (!project) {
    throw new NotFoundError();
  }

  return project.recentEvents;
}

export async function fetchDailyEventsPortion(
  projectId: string,
  nextCursor: string | null = null,
  sort = EventsSortOrder.ByDate,
  filters: EventsFilters = {},
  search = ''
): Promise<DailyEventsPortion | null> {
  const response = (await api.callOld(QUERY_PROJECT_OVERVIEW, {
    projectId,
    cursor: nextCursor,
    sort,
    filters,
    search,
  }));

  const project = response.data.project;

  if (!project) {
    throw new NotFoundError();
  }

  return project.dailyEventsPortion;
}

/**
 * Fetches latest event's repetitions from project
 *
 * @param {string} projectId - project's identifier
 * @param {string} eventId - event's identifier
 * @param {number} skip — the number of repetitions to skip
 * @param {number} limit - the number of repetitions
 *
 * @returns {Promise<Event[]>}
 */
export async function getLatestRepetitions(
  projectId: string, eventId: string, skip: number, limit: number
): Promise<APIResponse<{project: { event: { repetitions: HawkEventRepetition[] } } }>> {
  return api.call(QUERY_LATEST_REPETITIONS, {
    projectId,
    eventId,
    skip,
    limit,
  });
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
 * @param {string} eventId - event id
 * @param {number} days - how many days we need to fetchfor displaying in chart
 * @param {number} timezoneOffset - user's local timezone
 */
export async function fetchChartData(projectId: string, eventId: string, days: number, timezoneOffset: number): Promise<EventChartItem[]> {
  return (await api.callOld(QUERY_CHART_DATA, {
    projectId,
    eventId,
    days,
    timezoneOffset,
  })).project.event.chartData;
}
