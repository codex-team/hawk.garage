import {
  QUERY_EVENT,
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
 * @param projectId
 * @param eventId
 * @return {Promise<*>}
 */
export async function getRepetitions(projectId, eventId) {
  return (await api.call(QUERY_REPETITION_LIST, { projectId, eventId })).repetitions;
}
