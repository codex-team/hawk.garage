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

export async function fetchRecentProjectEvents(projectId, limit, skip) {
  return (await api.call(QUERY_RECENT_PROJECT_EVENTS, { projectId })).project.recentEvents;
}
