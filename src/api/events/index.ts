import {
  QUERY_EVENT,
  QUERY_LATEST_REPETITIONS,
  QUERY_RECENT_PROJECT_EVENTS
} from './queries';
import * as api from '@/api';
import {EventsWithDailyInfo, HawkEvent, HawkEventRepetition} from '@/types/events';

/**
 * Get specific event
 * @param {string} projectId - event's project
 * @param {string} eventId - id of the event
 * @return {Promise<HawkEvent>}
 */
export async function getEvent(projectId: string, eventId: string): Promise<HawkEvent | null> {
  return (await api.call(QUERY_EVENT, { projectId, eventId })).project.event;
}

/**
 * Returns latest project events
 * @param {string} projectId - id of the project to fetch recent errors
 * @param {number} skip - certain number of documents to skip
 * @return {Promise<EventsWithDailyInfo>}
 */
export async function fetchRecentEvents(projectId: string, skip = 0): Promise<EventsWithDailyInfo | null> {
  return (await api.call(QUERY_RECENT_PROJECT_EVENTS, { projectId, skip })).project.recentEvents;
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
  return (await api.call(QUERY_LATEST_REPETITIONS, { projectId, eventId, limit })).project.event.repetitions;
}

/**
 * Fetches event's repetition from project and returns last
 * @param {string} projectId - project's identifier
 * @param {string} eventId - event's identifier
 * @return {Promise<HawkEventRepetition | null>}
 */
export async function getLatestRepetition(projectId: string, eventId: string): Promise<HawkEventRepetition | null> {
  return (await api.call(QUERY_LATEST_REPETITIONS, { projectId, eventId })).project.event.repetitions.shift() || null;
}
