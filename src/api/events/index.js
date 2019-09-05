import {
  QUERY_EVENT,
  QUERY_RECENT_PROJECT_EVENTS,
  QUERY_LATEST_REPETITION
} from './queries';
import * as api from '../index';

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
 * @param {String} projectId
 * @param {String} eventId
 * @param {Number} limit
 *
 * @return {Promise<Event[]>}
 */
export async function getLatestRepetitions(projectId, eventId, limit) {
  return (await api.call(QUERY_LATEST_REPETITION, { projectId, eventId, limit })).project.event.repetitions;
}

/**
 * Fetches event's repetition from project and returns last
 *
 * @param {String} projectId
 * @param {String} eventId
 * @return {Promise<Event>}
 */
export async function getLatestRepetition(projectId, eventId) {
  return (await api.call(QUERY_LATEST_REPETITION, { projectId, eventId })).project.event.repetitions.shift();
}
