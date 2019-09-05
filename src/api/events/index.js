import {
  QUERY_EVENT,
  QUERY_RECENT_PROJECT_EVENTS
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
 * @param {Number} skip - certain number of documents to skip
 * @return {Promise<RecentEvents>}
 */
export async function fetchRecentEvents(projectId, skip = 0) {
  return (await api.call(QUERY_RECENT_PROJECT_EVENTS, { projectId, skip })).project.recentEvents;
}
