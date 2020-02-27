import {
  MUTATION_CREATE_PROJECT,
  QUERY_RECENT_ERRORS,
  MUTATION_UPDATE_LAST_VISIT,
  MUTATION_UPDATE_PROJECT
} from './queries';
import * as api from '../index.ts';

/**
 * Create project and returns its id
 * @param {Project} projectInfo - project to create
 * @return {Promise<Project.id>}
 */
export async function createProject(projectInfo) {
  const { image, ...rest } = projectInfo;

  return (await api.call(MUTATION_CREATE_PROJECT, rest, { image })).createProject;
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

/**
 * Updates project last visit time and returns it
 *
 * @param {String} projectId - project ID
 * @return {Promise<Number>}
 */
export async function updateLastProjectVisit(projectId) {
  return (await api.call(MUTATION_UPDATE_LAST_VISIT, { projectId })).setLastProjectVisit;
}

/**
 * Update project data
 *
 * @param {String} id - project ID
 * @param {String} name - project name
 * @param {String} description - project description
 * @param {File} image - project image
 * @returns {Promise<Boolean>}
 */
export async function updateProject(id, name, description, image) {
  return (await api.call(MUTATION_UPDATE_PROJECT, {
    id,
    name,
    description,
  }, { image })).updateProject;
}
