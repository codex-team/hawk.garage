import {
  MUTATION_CREATE_PROJECT,
  MUTATION_UPDATE_PROJECT,
  MUTATION_UPDATE_PROJECT_RATE_LIMITS,
  MUTATION_UPDATE_LAST_VISIT,
  MUTATION_CREATE_PROJECT_NOTIFY_RULE,
  MUTATION_UPDATE_PROJECT_NOTIFY_RULE,
  MUTATION_REMOVE_PROJECT_NOTIFY_RULE,
  MUTATION_CREATE_PROJECT_PATTERN,
  MUTATION_UPDATE_PROJECT_PATTERN,
  MUTATION_REMOVE_PROJECT_PATTERN,
  MUTATION_REMOVE_PROJECT,
  MUTATION_TOGGLE_ENABLED_STATE_OF_A_PROJECT_NOTIFY_RULE,
  MUTATION_UNSUBSCRIBE_FROM_NOTIFICATIONS,
  QUERY_CHART_DATA,
  MUTATION_GENERATE_NEW_INTEGRATION_TOKEN,
  QUERY_PROJECT_RELEASES,
  QUERY_PROJECT_RELEASE_DETAILS,
  MUTATION_DISCONNECT_TASK_MANAGER
} from './queries';
import * as api from '../index.ts';

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
 * Update project rate limit settings
 *
 * @param {string} id - project id
 * @param {ProjectRateLimitSettings | null} rateLimitSettings - rate limit settings (null to remove)
 * @returns {Promise<ProjectRateLimitSettings | null>}
 */
export async function updateProjectRateLimits(id, rateLimitSettings) {
  const response = await api.call(
    MUTATION_UPDATE_PROJECT_RATE_LIMITS,
    { id,
      rateLimitSettings },
    undefined,
    { allowErrors: true }
  );

  if (response.errors?.length) {
    response.errors.forEach(e => console.error(e));
  }

  const updatedProjectRateLimits = response.data.updateProjectRateLimits;

  return updatedProjectRateLimits;
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
 * @returns {Promise<APIResponse<ProjectNotificationsRule>>}
 */
export async function addProjectNotificationsRule(payload) {
  return (await api.call(MUTATION_CREATE_PROJECT_NOTIFY_RULE, {
    input: payload,
  }));
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
 * Loads "accepted" and "rate-limited" chart data for a project
 *
 * @param {string} projectId - id of the project to load chart data for
 * @param {string} startDate - start date (ISO string or Unix timestamp in seconds)
 * @param {string} endDate - end date (ISO string or Unix timestamp in seconds)
 * @param {number} groupBy - grouping interval in minutes (1=minute, 60=hour, 1440=day)
 * @param {number} timezoneOffset - user's local timezone offset
 * @returns {Promise<APIResponse<{project: {chartData: ChartData[]}}>>}
 */
export async function fetchChartData(projectId, startDate, endDate, groupBy, timezoneOffset) {
  const response = await api.call(QUERY_CHART_DATA, {
    projectId,
    startDate,
    endDate,
    groupBy,
    timezoneOffset,
  }, undefined, {
    /**
     * Allow errors to be returned in response for handling in store/component
     */
    allowErrors: true,
  });

  return response;
}

/**
 * Fetch project releases
 *
 * @param {string} projectId - id of the project to fetch releases
 * @returns {Promise<Array<{release: string, timestamp: number, newEventsCount: number, commitsCount: number, filesCount: number}>>} - list of releases with unique events count, commits count and files count
 */
export async function fetchProjectReleases(projectId) {
  const response = await api.call(QUERY_PROJECT_RELEASES, { projectId });

  if (response.errors?.length) {
    response.errors.forEach(console.error);
  }

  return response.data.project.releases;
}

/**
 * Fetch specific release details
 *
 * @param {string} projectId
 * @param {string} release
 * @returns {Promise<ReleaseDetails>}
 */
export async function fetchProjectReleaseDetails(projectId, release) {
  const response = await api.call(QUERY_PROJECT_RELEASE_DETAILS, { projectId,
    release });

  if (response.errors?.length) {
    /**
     * Throw error if release not found or other API errors
     */
    const error = new Error(response.errors[0].message);

    error.name = response.errors[0].extensions?.code || 'API_ERROR';

    throw error;
  }

  return response.data.project.releaseDetails;
}

/**
 * Send request for unsubscribing from notifications
 *
 * @param payload - unsubscribe payload
 */
export async function unsubscribeFromNotifications(payload) {
  return (await api.call(MUTATION_UNSUBSCRIBE_FROM_NOTIFICATIONS, {
    input: payload,
  })).unsubscribeFromNotifications;
}

/**
 * Disconnect task manager integration from project
 *
 * @param {string} projectId - project id
 * @returns {Promise<Project>}
 */
export async function disconnectTaskManager(projectId) {
  const response = await api.call(MUTATION_DISCONNECT_TASK_MANAGER, { projectId });

  if (response.errors?.length) {
    response.errors.forEach(e => console.error(e));
  }

  return response.data.disconnectTaskManager;
}
