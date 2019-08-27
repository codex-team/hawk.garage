import { MUTATION_CREATE_PROJECT, QUERY_RECENT_ERRORS, QUERY_REPETITION_LIST } from './queries';
import * as api from '../index';

/**
 * Create project and returns its id
 * @param {Project} projectInfo - project to create
 * @return {Promise<Project.id>}
 */
export async function createProject(projectInfo) {
  return (await api.call(MUTATION_CREATE_PROJECT, projectInfo)).createProject;
}

/**
 * @param projectId
 * @param eventId
 * @return {Promise<*>}
 */
export async function getRepetitions(projectId, eventId) {
  return (await api.call(QUERY_REPETITION_LIST, { projectId, eventId })).repetitions;
}
/**
 * @typedef RecentEvent
 * @property {Event} event - occurred event
 * @property {Number} count - number of this error
 * @property {Date} date - date when error occurred
 */

/**
 * Fetch latest project events
 * @param {String} projectId - project to fetch errors
 * @return {Promise<RecentEvent[]>}
 */
export async function fetchRecentErrors(projectId) {
  return (await api.call(QUERY_RECENT_ERRORS, { projectId })).recent;
}
