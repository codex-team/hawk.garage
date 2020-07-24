import {
  MUTATION_TOGGLE_EVENT_MARK,
  MUTATION_VISIT_EVENT,
  MUTATION_UPDATE_EVENT_ASSIGNEE,
  MUTATION_REMOVE_EVENT_ASSIGNEE,
  QUERY_EVENT,
  QUERY_LATEST_REPETITIONS,
  QUERY_RECENT_PROJECT_EVENTS
} from './queries';
import * as api from '@/api';
import {
  EventMark,
  EventsFilters,
  EventsSortOrder,
  EventsWithDailyInfo,
  HawkEvent,
  HawkEventRepetition
} from '@/types/events';
import { User } from '@/types/user';

/**
 * Get specific event
 *
 * @param {string} projectId - event's project
 * @param {string} eventId - id of the event
 * @param {string} repetitionId - event's concrete repetition. This param is optional
 * @returns {Promise<HawkEvent>}
 */
export async function getEvent(projectId: string, eventId: string, repetitionId: string): Promise<HawkEvent | null> {
  return (await api.call(QUERY_EVENT, {
    projectId,
    eventId,
    repetitionId,
  })).project.event;
}

/**
 * Returns latest project events
 *
 * @param {string} projectId - id of the project to fetch recent errors
 * @param {number} skip - certain number of documents to skip
 * @param {EventsSortOrder} sort - events sort order to use
 * @param {EventsFilters} filters - events filters to use
 * @returns {Promise<EventsWithDailyInfo>}
 */
export async function fetchRecentEvents(
  projectId: string,
  skip = 0,
  sort = EventsSortOrder.ByDate,
  filters: EventsFilters = {}
): Promise<EventsWithDailyInfo | null> {
  return (await api.call(QUERY_RECENT_PROJECT_EVENTS, {
    projectId,
    skip,
    sort,
    filters,
  })).project.recentEvents;
}

/**
 * Fetches latest event's repetitions from project
 *
 * @param {string} projectId - project's identifier
 * @param {string} eventId - event's identifier
 * @param {number} limit - the number of repetitions
 *
 * @returns {Promise<Event[]>}
 */
export async function getLatestRepetitions(
  projectId: string, eventId: string, limit: number
): Promise<HawkEventRepetition[]> {
  return (await api.call(QUERY_LATEST_REPETITIONS, {
    projectId,
    eventId,
    limit,
  })).project.event.repetitions;
}

/**
 * Fetches event's repetition from project and returns last
 *
 * @param {string} projectId - project's identifier
 * @param {string} eventId - event's identifier
 * @returns {Promise<HawkEventRepetition | null>}
 */
export async function getLatestRepetition(projectId: string, eventId: string): Promise<HawkEventRepetition | null> {
  return (await api.call(QUERY_LATEST_REPETITIONS, {
    projectId,
    eventId,
  })).project.event.repetitions.shift() || null;
}

/**
 * Mark event as visited for current user
 *
 * @param {string} projectId - project event related to
 * @param {string} eventId — visited event
 * @returns {Promise<boolean>}
 */
export async function visitEvent(projectId: string, eventId: string): Promise<boolean> {
  return (await api.call(MUTATION_VISIT_EVENT, {
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
  return (await api.call(MUTATION_TOGGLE_EVENT_MARK, {
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
  return (await api.call(MUTATION_UPDATE_EVENT_ASSIGNEE, {
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
  return (await api.call(MUTATION_REMOVE_EVENT_ASSIGNEE, {
    input: {
      projectId,
      eventId,
    },
  })).events.removeAssignee;
}
