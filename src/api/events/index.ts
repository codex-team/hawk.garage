import {
  MUTATION_TOGGLE_EVENT_MARK,
  MUTATION_VISIT_EVENT,
  QUERY_EVENT,
  QUERY_LATEST_REPETITIONS,
  QUERY_RECENT_PROJECT_EVENTS,
  QUERY_CHART_DATA
} from './queries';
import * as api from '@/api';
import { EventMark, EventsWithDailyInfo, HawkEvent, HawkEventRepetition, HawkEventDailyInfo } from '@/types/events';

/**
 * Get specific event
 * @param {string} projectId - event's project
 * @param {string} eventId - id of the event
 * @param {string} repetitionId - event's concrete repetition. This param is optional
 * @return {Promise<HawkEvent>}
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
 * @param {string} projectId - id of the project to fetch recent errors
 * @param {number} skip - certain number of documents to skip
 * @return {Promise<EventsWithDailyInfo>}
 */
export async function fetchRecentEvents(projectId: string, skip = 0): Promise<EventsWithDailyInfo | null> {
  return (await api.call(QUERY_RECENT_PROJECT_EVENTS, {
    projectId,
    skip,
  })).project.recentEvents;
}

/**
 * Fetches latest event's repetitions from project
 *
 * @param {string} projectId - project's identifier
 * @param {string} eventId - event's identifier
 * @param {Number} limit - the number of repetitions
 *
 * @return {Promise<Event[]>}
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
 * @param {string} projectId - project's identifier
 * @param {string} eventId - event's identifier
 * @return {Promise<HawkEventRepetition | null>}
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
 * @return {Promise<boolean>}
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
 * Fetch data for chart
 * @param {string} projectId - id of the project to fetch recent errors
 * @param {number} since - events will be collected no later than this time timestamp
 * @return {Promise<EventsWithDailyInfo>}
 */
export async function fetchChartData(projectId: string, since: number): Promise<HawkEventDailyInfo[] | null> {
  return (await api.call(QUERY_CHART_DATA, {
    projectId,
    since,
  })).project.chartData;
}