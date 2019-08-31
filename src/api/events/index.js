import {
  QUERY_EVENT,
  QUERY_RECENT_PROJECT_EVENTS,
  QUERY_REPETITION_LIST
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
  return (await api.call(QUERY_EVENT, { projectId, eventId })).event;
}

/**
 * Returns latest project events
 * @param {String} projectId - id of the project to fetch recent errors
 * @return {Promise<RecentEvents>}
 */
export async function fetchRecentProjectEvents(projectId) {
  return (await api.call(QUERY_RECENT_PROJECT_EVENTS, { projectId })).project.recentEvents;
}

/**
 * Returns Event's repetitions
 *
 * @param {String} projectId
 * @param {String} eventId
 * @return {Promise<Event[]>}
 */
export async function getRepetitions(projectId, eventId) {
  return (await api.call(QUERY_REPETITION_LIST, { projectId, eventId })).repetitions;
}
