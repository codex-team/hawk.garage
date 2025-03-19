/**
 * Set new projects list
 */
export const SET_PROJECTS_LIST = 'SET_PROJECTS_LIST';

/**
 * Send request to create new project
 */
export const CREATE_PROJECT = 'CREATE_PROJECT';

/**
 * Remove projects by workspace id from list
 */
export const REMOVE_PROJECTS_BY_WORKSPACE_ID = 'REMOVE_PROJECTS_BY_WORKSPACE_ID';

/**
 * Send request to update project settings
 */
export const UPDATE_PROJECT = 'UPDATE_PROJECT';

/**
 * Send request to generate new integration token
 */
export const GENERATE_NEW_INTEGRATION_TOKEN = 'GENERATE_NEW_INTEGRATION_TOKEN';

/**
 * Send request to remove project
 */
export const REMOVE_PROJECT = 'REMOVE_PROJECT';

/**
 * Fetch project recent errors
 */
export const FETCH_RECENT_ERRORS = 'FETCH_RECENT_ERRORS';

/**
 * Fetch project releases
 */
export const FETCH_PROJECT_RELEASES = 'FETCH_PROJECT_RELEASES';

/**
 * Sends request to set last project visit
 */
export const UPDATE_PROJECT_LAST_VISIT = 'UPDATE_PROJECT_LAST_VISIT';

/**
 * Add new notifications rule
 */
export const ADD_NOTIFICATIONS_RULE = 'ADD_NOTIFICATIONS_RULE';

/**
 * Update the notifications rule
 */
export const UPDATE_NOTIFICATIONS_RULE = 'UPDATE_NOTIFICATIONS_RULE';

/**
 * Remove notifications rule
 */
export const REMOVE_NOTIFICATIONS_RULE = 'REMOVE_NOTIFICATIONS_RULE';

/**
 * Toggle isEnabled state of the notifications rule
 */
export const TOGGLE_NOTIFICATIONS_RULE_ENABLED_STATE = 'TOGGLE_NOTIFICATIONS_RULE_ENABLED_STATE';

/**
 * Get events counters for the last N days at the specific project
 */
export const FETCH_CHART_DATA = 'FETCH_CHART_DATA';
