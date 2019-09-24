/**
 * Action for initialization this module. The transferred list (events, recent events) values are assigned to the state
 */
export const INIT_EVENTS_MODULE = 'INIT_EVENTS_MODULE';

/**
 * Action for fetching latest event
 */
export const FETCH_LATEST_EVENT = 'FETCH_LATEST_EVENT';

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
