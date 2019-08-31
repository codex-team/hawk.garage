import {
  MUTATION_CREATE_PROJECT,
  MUTATION_UPDATE_PERSONAL_NOTIFICATION_SETTINGS, QUERY_COMMON_NOTIFICATION_SETTINGS, QUERY_COMMON_SETTINGS,
  QUERY_PERSONAL_NOTIFICATION_SETTINGS,
  QUERY_RECENT_ERRORS
} from './queries';
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
 * @typedef {Object} ProviderSettings
 * @property {Boolean} enabled - provider enabled?
 * @property {String} value - provider hook/email/etc
 */

/**
 * @typedef {Object} NotifySettings
 * @property {ProviderSettings} email
 * @property {ProviderSettings} tg
 * @property {ProviderSettings} slack
 */

/**
 * @typedef {Object} Notify
 * @property {number} actionType - action type. {ONLY_NEW: 1, ALL: 2, INCLUDING: 3}
 * @property {string} words - filter words when action type is INCLUDING
 * @property {NotifySettings} settings - notify settings
 */

/**
 * Get project personal notification settings
 * @param projectId - Project ID
 * @returns {Promise<Notify>}
 */
export async function personalNotificationSettings(projectId) {
  return (await api.call(QUERY_PERSONAL_NOTIFICATION_SETTINGS, { projectId })).personalNotificationSettings;
}

/**
 * Get project common notification settings
 * @param projectId - Project ID
 * @returns {Promise<Notify>}
 */
export async function commonNotificationSettings(projectId) {
  return (await api.call(QUERY_COMMON_NOTIFICATION_SETTINGS, { projectId })).commonNotificationSettings;
}

/**
 * Update project personal notificaion settings
 * @param {string} projectId - Project ID
 * @param {Notify} notify - Notify object
 * @returns {Promise<Notify>}
 */
export async function updatePersonalNotificationSettings(projectId, notify) {
  return (await api.call(MUTATION_UPDATE_PERSONAL_NOTIFICATION_SETTINGS, {
    projectId,
    notify
  })).updatePersonalNotificationSettings;
}

/**
 * Update project common notificaion settings
 * @param {string} projectId - Project ID
 * @param {Notify} notify - Notify object
 * @returns {Promise<Notify>}
 */
export async function updateCommonNotificationSettings(projectId, notify) {
  return (await api.call(MUTATION_UPDATE_PERSONAL_NOTIFICATION_SETTINGS, {
    projectId,
    notify
  })).updateCommonNotificationSettings;
}
