import {
  MUTATION_CREATE_PROJECT,
  MUTATION_UPDATE_PROJECT,
  QUERY_RECENT_ERRORS,
  MUTATION_UPDATE_LAST_VISIT,
  MUTATION_CREATE_PROJECT_NOTIFY_RULE,
  MUTATION_UPDATE_PROJECT_NOTIFY_RULE,
  MUTATION_TOGGLE_ENABLED_STATE_OF_A_PROJECT_NOTIFY_RULE
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
 * Update project in db
 * @param {Project} projectInfo - project to update
 * @return {Promise<Project>}
 */
export async function updateProject(projectInfo) {
  const { image, ...rest } = projectInfo;

  return (await api.call(MUTATION_UPDATE_PROJECT, rest, { image })).updateProject;
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
 * Send request for creation new project notifications rule
 * @param {ProjectNotificationsAddRulePayload} payload - add rule payload
 * @return {Promise<ProjectNotificationsRule>}
 */
export async function addProjectNotificationsRule(payload) {
  return (await api.call(MUTATION_CREATE_PROJECT_NOTIFY_RULE, {
    input: payload,
  })).createProjectNotificationsRule;
}

/**
 * Send request for updating specific project notifications rule
 * @param {ProjectNotificationsUpdateRulePayload} payload - update rule payload
 * @return {Promise<ProjectNotificationsRule>}
 */
export async function updateProjectNotificationsRule(payload) {
  return (await api.call(MUTATION_UPDATE_PROJECT_NOTIFY_RULE, {
    input: payload,
  })).updateProjectNotificationsRule;
}

/**
 * Send request for updating specific project notifications rule
 * @param {ProjectNotificationRulePointer} payload - update rule payload
 * @return {Promise<ProjectNotificationsRule>}
 */
export async function toggleEnabledStateOfProjectNotificationsRule(payload) {
  return (await api.call(MUTATION_TOGGLE_ENABLED_STATE_OF_A_PROJECT_NOTIFY_RULE, {
    input: payload,
  })).toggleProjectNotificationsRuleEnabledState;
}
