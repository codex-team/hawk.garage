import {
  MUTATION_CREATE_PROJECT,
  MUTATION_UPDATE_PROJECT,
  QUERY_RECENT_ERRORS,
  MUTATION_UPDATE_LAST_VISIT,
  MUTATION_CREATE_PROJECT_NOTIFY_RULE,
  MUTATION_UPDATE_PROJECT_NOTIFY_RULE,
  MUTATION_REMOVE_PROJECT_NOTIFY_RULE,
  MUTATION_CREATE_PROJECT_PATTERN,
  MUTATION_UPDATE_PROJECT_PATTERN,
  MUTATION_REMOVE_PROJECT_PATTERN,
  MUTATION_REMOVE_PROJECT,
  MUTATION_TOGGLE_ENABLED_STATE_OF_A_PROJECT_NOTIFY_RULE,
  QUERY_CHART_DATA, MUTATION_GENERATE_NEW_INTEGRATION_TOKEN
} from './queries';
import * as api from '../index.ts';
import { ChartData } from '../../types/events';

/**
 * Create project and returns its id
 *
 * @param {Project} projectInfo - project to create
 * @returns {Promise<Project.id>}
 */
export async function createProject(projectInfo) {
  const { image, ...rest } = projectInfo;

  return (await api.call(MUTATION_CREATE_PROJECT, rest, { image }));
}

/**
 * Update project in db
 *
 * @param {Project} projectInfo - project to update
 * @returns {Promise<Project>}
 */
export async function updateProject(projectInfo) {
  const { image, ...rest } = projectInfo;

  return (await api.callOld(MUTATION_UPDATE_PROJECT, rest, { image })).updateProject;
}

/**
 * @typedef {object} UpdateIntegrationTokenResponse
 * @property {string} recordId - updated project id
 * @property {ProjectDBScheme} record - updated project object
 */

/**
 * Generates new integration token by project ID
 *
 * @param {string} id - project id
 *
 * @returns {Promise<APIResponse<UpdateIntegrationTokenResponse>>}
 */
export function generateNewIntegrationToken(id) {
  return api.call(MUTATION_GENERATE_NEW_INTEGRATION_TOKEN, { id });
}

/**
 * Remove project from db
 *
 * @param {string} projectId - project to remove
 * @returns {Promise<boolean>}
 */
export async function removeProject(projectId) {
  return (await api.callOld(MUTATION_REMOVE_PROJECT, { projectId })).removeProject;
}

/**
 * @typedef RecentEvent
 * @property {Event} event - occurred event
 * @property {number} count - number of this error
 * @property {Date} date - date when error occurred
 */

/**
 * Fetch latest project events
 *
 * @param {string} projectId - project to fetch errors
 * @returns {Promise<RecentEvent[]>}
 */
export async function fetchRecentErrors(projectId) {
  return (await api.callOld(QUERY_RECENT_ERRORS, { projectId })).recent;
}

/**
 * Updates project last visit time and returns it
 *
 * @param {string} projectId - project ID
 * @returns {Promise<number>}
 */
export async function updateLastProjectVisit(projectId) {
  return (await api.callOld(MUTATION_UPDATE_LAST_VISIT, { projectId })).setLastProjectVisit;
}

/**
 * Send request for creation new project notifications rule
 *
 * @param {ProjectNotificationsAddRulePayload} payload - add rule payload
 * @returns {Promise<ProjectNotificationsRule>}
 */
export async function addProjectNotificationsRule(payload) {
  return (await api.callOld(MUTATION_CREATE_PROJECT_NOTIFY_RULE, {
    input: payload,
  })).createProjectNotificationsRule;
}

/**
 * Send request for updating specific project notifications rule
 *
 * @param {ProjectNotificationsUpdateRulePayload} payload - update rule payload
 * @returns {Promise<ProjectNotificationsRule>}
 */
export async function updateProjectNotificationsRule(payload) {
  return (await api.callOld(MUTATION_UPDATE_PROJECT_NOTIFY_RULE, {
    input: payload,
  })).updateProjectNotificationsRule;
}

/**
 * Send request for creation new project event grouping pattern
 *
 * @param {AddProjectEventGroupingPatternPayload} payload - add pattern payload
 * @returns {Promise<ProjectEventGroupingPattern>} - created pattern
 */
export async function addEventGroupingPattern(payload) {
  const response = (await api.call(MUTATION_CREATE_PROJECT_PATTERN, {
    input: payload,
  }));

  const addedPattern = response.data.createProjectEventGroupingPattern;

  return addedPattern;
}

/**
 * Send request for updating specific project event grouping pattern
 *
 * @param {UpdateProjectEventGroupingPatternPayload} payload - update pattern payload
 * @returns {Promise<ProjectEventGroupingPattern>} - updated pattern
 */
export async function updateEventGroupingPattern(payload) {
  const response = await api.call(MUTATION_UPDATE_PROJECT_PATTERN, {
    input: payload,
  });

  const updatedPattern = response.data.updateProjectEventGroupingPattern;

  return updatedPattern;
}

/**
 * Send request for removing specific project event grouping pattern
 *
 * @param {ProjectEventGroupingPatternPointer} payload - remove pattern payload
 * @returns {Promise<ProjectEventGroupingPattern>} - removed pattern
 */
export async function removeEventGroupingPattern(payload) {
  const response = await api.call(MUTATION_REMOVE_PROJECT_PATTERN, {
    input: payload,
  });

  const removedPattern = response.data.removeProjectEventGroupingPattern;

  return removedPattern;
}

/**
 * Send request for removing specific project notifications rule
 *
 * @param {ProjectNotificationRulePointer} payload - update rule payload
 * @returns {Promise<ProjectNotificationsRule>}
 */
export async function removeProjectNotificationsRule(payload) {
  return (await api.callOld(MUTATION_REMOVE_PROJECT_NOTIFY_RULE, {
    input: payload,
  })).removeProjectNotificationsRule;
}

/**
 * Send request for updating specific project notifications rule
 *
 * @param {ProjectNotificationRulePointer} payload - update rule payload
 * @returns {Promise<ProjectNotificationsRule>}
 */
export async function toggleEnabledStateOfProjectNotificationsRule(payload) {
  return (await api.callOld(MUTATION_TOGGLE_ENABLED_STATE_OF_A_PROJECT_NOTIFY_RULE, {
    input: payload,
  })).toggleProjectNotificationsRuleEnabledState;
}

/**
 * Fetch data for chart
 *
 * @param {string} projectId - id of the project to fetch recent errors
 * @param {number} days - fow how many days we need to get counters
 * @param {number} timezoneOffset - user's local timezone offset
 * @returns {Promise<ChartData[] | null>}
 */
export async function fetchChartData(projectId, days, timezoneOffset) {
  return (await api.callOld(QUERY_CHART_DATA, {
    projectId,
    days,
    timezoneOffset,
  })).project.chartData;
}
