/**
 * Сonstants for naming mutations and actions
 */

/**
 * Send login request to the server and performs user login
 */
export const AUTH_REQUEST = 'AUTH_REQUEST';

/**
 * Mutation caused by successful authentication
 */
export const AUTH_SUCCESS = 'AUTH_SUCCESS';

/**
 * Mutation caused by unsuccessful authentication
 * Called when some errors occur during the authentication process
 */
export const AUTH_ERROR = 'AUTH_ERROR';

/**
 * Mutation caused when user logout
 */
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

/**
 * Send sign up request to the server and performs user login
 */
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
