/**
 * Action for initialization this module. The transferred list (events, recent events) values are assigned to the state
 */
export const INIT_EVENTS_MODULE = 'INIT_EVENTS_MODULE';

/**
 * Action for fetching event concrete repetition
 */
export const FETCH_EVENT_REPETITION = 'FETCH_EVENT_REPETITION';

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
