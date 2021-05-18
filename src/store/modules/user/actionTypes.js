/**
 * Send login request to the server and performs user login
 */
export const LOGIN = 'LOGIN';

/**
 * Send sign up request to the server
 */
export const SIGN_UP = 'SIGN_UP';

/**
 * Send recover password request to the server
 */
export const RECOVER_PASSWORD = 'RECOVER_PASSWORD';

/**
 * Set tokens from query parameters
 */
export const SET_TOKENS = 'SET_TOKENS';

/**
 * Action for refreshing tokens pair
 */
export const REFRESH_TOKENS = 'REFRESH_TOKENS';

/**
 * Fetch current user data
 */
export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

/**
 * Update user profile
 */
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

/**
 * Change user password
 */
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';

/**
 * Change notifications channel settings
 */
export const CHANGE_NOTIFICATIONS_CHANNEL = 'CHANGE_NOTIFICATIONS_CHANNEL';

/**
 * Fetches uses notifications settings
 */
export const FETCH_NOTIFICATIONS_SETTINGS = 'FETCH_NOTIFICATIONS_SETTINGS';

/**
 * Change notifications 'whatToReceive' settings
 */
export const CHANGE_NOTIFICATIONS_RECEIVE_TYPE = 'CHANGE_NOTIFICATIONS_RECEIVE_TYPE';

/**
 * Fetches user's bank cards for one-click payments
 */
export const FETCH_BANK_CARDS = 'FETCH_BANK_CARDS';
