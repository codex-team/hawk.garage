/**
 * Action for initialization this module. The transferred list (events, recent events) values are assigned to the state
 */
export const INIT_EVENTS_MODULE = 'INIT_EVENTS_MODULE';

/**
 * Action for fetching event concrete repetition
 */
export const FETCH_EVENT = 'FETCH_EVENT';

/**
 * Fetch project recent events
 */
export const FETCH_RECENT_EVENTS = 'FETCH_RECENT_EVENTS';

/**
 * Action for fetching latest event's repetitions
 */
export const FETCH_EVENT_REPETITIONS = 'FETCH_EVENT_REPETITIONS';

/**
 * Action that returns last event: original event merged with last repetition
 */
export const GET_LATEST_EVENT = 'GET_LATEST_EVENT';

/**
 * Action for marking event as visited
 */
export const VISIT_EVENT = 'VISIT_EVENT';

/**
 * Action to set or unset mark to event
 */
export const TOGGLE_EVENT_MARK = 'TOGGLE_EVENT_MARK';

/**
 * Update event assigneee
 */
export const UPDATE_EVENT_ASSIGNEE = 'UPDATE_EVENT_ASSIGNEE';

/**
 * Remove event assignee
 */
export const REMOVE_EVENT_ASSIGNEE = 'REMOVE_EVENT_ASSIGNEE';

/**
 * Set events order to use
 */
export const SET_EVENTS_ORDER = 'SET_EVENTS_ORDER';

/**
 * Set events filters to use
 */
export const SET_EVENTS_FILTERS = 'SET_EVENTS_FILTERS';

/**
 * Get chart data for target event
 */
export const GET_CHART_DATA = 'GET_CHART_DATA';

/**
 * Get affected users chart data for target event
 */
export const GET_AFFECTED_USERS_CHART_DATA = 'GET_AFFECTED_USERS_CHART_DATA';

/**
 * Get list project with dailyEvents portion
 */
export const FETCH_PROJECT_OVERVIEW = 'FETCH_PROJECT_OVERVIEW';
