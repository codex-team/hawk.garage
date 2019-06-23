/**
 * @file Сonstants for naming mutations and actions
 */

/**
 * Actions
 */

/**
 * Send login request to the server and performs user login
 */
export const LOGIN = 'LOGIN';

/**
 * Send sign up request to the server and performs user login
 */
export const SIGN_UP = 'SIGN_UP';

/**
 * Action for refreshing tokens pair
 */
export const REFRESH_TOKENS = 'REFRESH_TOKENS';

/**
 * Mutations
 */

/**
 * Sets user's auth tokens
 * (for example, after authentication or updating tokens)
 */
export const SET_TOKENS = 'SET_TOKENS';

/**
 * Removes user's auth tokens (for example, when logout)
 */
export const REMOVE_TOKENS = 'REMOVE_TOKENS';
