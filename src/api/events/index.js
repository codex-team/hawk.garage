import {
  QUERY_EVENT,
  QUERY_RECENT_PROJECT_EVENTS,
  QUERY_LATEST_REPETITIONS
} from './queries';
import * as api from '../index.ts';

/**
 * Get specific event
 *
 * @param {string} projectId - event's project
 * @param {string} eventId - id of the event
 * @return {Promise<Object>}
 */
export async function getEvent(projectId, eventId) {
  return (await api.call(QUERY_EVENT, { projectId, eventId })).project.event;
}

/**
 * Returns latest project events
 * @param {String} projectId - id of the project to fetch recent errors
 * @param {Number} skip - certain number of documents to skip
 * @return {Promise<RecentEvents>}
 */
export async function fetchRecentEvents(projectId, skip = 0) {
  return (await api.call(QUERY_RECENT_PROJECT_EVENTS, { projectId, skip })).project.recentEvents;
}

/**
 * Fetches latest event's repetitions from project
 *
 * @param {String} projectId - project's identifier
 * @param {String} eventId - event's identifier
 * @param {Number} limit - the number of repetitions
 *
 * @return {Promise<Event[]>}
 */
export async function getLatestRepetitions(projectId, eventId, limit) {
  return (await api.call(QUERY_LATEST_REPETITIONS, { projectId, eventId, limit })).project.event.repetitions;
}

/**
 * Fetches event's repetition from project and returns last
 *
 * @param {String} projectId - project's identifier
 * @param {String} eventId - event's identifier
 * @return {Promise<Event>}
 */
export async function getLatestRepetition(projectId, eventId) {
  return (await api.call(QUERY_LATEST_REPETITIONS, { projectId, eventId })).project.event.repetitions.shift();
}
