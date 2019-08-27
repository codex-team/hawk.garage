import {
  MUTATION_CREATE_PROJECT,
  MUTATION_UPDATE_NOTIFICATION_SETTINGS,
  QUERY_NOTIFICATION_SETTINGS,
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
 * Get notification settings
 * @param projectId - Project ID
 * @returns {Promise<Notify>}
 */
export async function notificationSettings(projectId) {
  return (await api.call(QUERY_NOTIFICATION_SETTINGS, { projectId })).notificationSettings;
}

/**
 * Update notificaion settings
 * @param {string} projectId - Project ID
 * @param {Notify} notify - Notify object
 * @returns {Promise<Boolean>}
 */
export async function updateNotificationSettings(projectId, notify) {
  return (await api.call(MUTATION_UPDATE_NOTIFICATION_SETTINGS, {
    projectId,
    notify
  })).updateNotificationSettings;
}
