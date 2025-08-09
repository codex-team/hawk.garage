import {
  MUTATION_CHANGE_PASSWORD,
  MUTATION_LOGIN,
  MUTATION_REFRESH_TOKENS,
  MUTATION_SIGN_UP,
  MUTATION_RECOVER_PASSWORD,
  MUTATION_UPDATE_PROFILE,
  QUERY_CURRENT_USER,
  MUTATION_CHANGE_USER_NOTIFICATIONS_CHANNEL,
  MUTATION_CHANGE_USER_NOTIFICATIONS_RECEIVE_TYPE,
  QUERY_CURRENT_USER_WITH_NOTIFICATIONS, QUERY_BANK_CARDS
} from './queries';
import * as api from '../index.ts';
import { processUtmParams } from '../../utils/utm';

/**
 * @typedef {object} TokensPair
 * @property {string} accessToken - user's access token
 * @property {string} refreshToken - user's refresh token for getting new tokens pair
 */

/**
 * Login user and get token
 *
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Promise<{data: {login: TokensPair}, errors: object[]}>} - Auth token
 */
export async function login(email, password) {
  return api.call(MUTATION_LOGIN, {
    email,
    password,
  });
}

/**
 * Sign up by email and return status (true or false)
 *
 * @param {string} email - Email
 * @param {object} utm - UTM parameters object
 * @returns {Promise<{data: {signUp: boolean}, errors: object[]}>} Response data
 */
export async function signUp(email, utm) {
  const variables = { email };

  // Process UTM data (validate and sanitize)
  const processedUtm = processUtmParams(utm);
  if (processedUtm) {
    variables.utm = processedUtm;
  }

  return api.call(MUTATION_SIGN_UP, variables);
}

/**
 * Recover password by email
 *
 * @param {string} email - user Email
 * @returns {Promise<{data: {resetPassword: boolean}, errors: object[]}>} Response data
 */
export async function recoverPassword(email) {
  return api.call(MUTATION_RECOVER_PASSWORD, { email });
}

/**
 * Get new tokens pair by refreshToken
 *
 * @param {string} refreshToken - user's refresh token
 * @returns {Promise<TokensPair>}
 */
export async function refreshTokens(refreshToken) {
  return (await api.callOld(MUTATION_REFRESH_TOKENS, { refreshToken }, undefined, { force: true })).refreshTokens;
}

/**
 * Get current user
 *
 * @returns {Promise<APIResponse<{ me: User }>>}
 */
export async function fetchCurrentUser() {
  return await api.call(QUERY_CURRENT_USER, {}, undefined, { allowErrors: true });
}

/**
 * Update user profile
 *
 * @param {string} name - user name
 * @param {string} email - user email address
 * @param {File} image - profile picture file uploading
 * @returns {Promise<boolean>}
 */
export async function updateProfile(name, email, image) {
  return api.call(MUTATION_UPDATE_PROFILE, {
    name,
    email,
  }, { image });
}

/**
 * Change user password
 *
 * @param {string} oldPassword - current password
 * @param {string} newPassword - password to change
 * @returns {Promise<boolean>}
 */
export async function changePassword(oldPassword, newPassword) {
  return api.call(MUTATION_CHANGE_PASSWORD, {
    oldPassword,
    newPassword,
  });
}

/**
 * Query user data with the only notifications property
 *
 * @returns {Promise<Pick<User, 'notifications'>>}
 */
export async function fetchNotificationsSettings() {
  return (await api.callOld(QUERY_CURRENT_USER_WITH_NOTIFICATIONS)).me;
}

/**
 * Change notifications channel settings
 *
 * @param {UserNotificationsChannels} payload - new channel settings
 * @returns {Promise<{notifications: UserNotifications}>}
 */
export async function updateNotificationsChannel(payload) {
  return (await api.callOld(MUTATION_CHANGE_USER_NOTIFICATIONS_CHANNEL, {
    input: payload,
  })).changeUserNotificationsChannel;
}

/**
 * Change notifications receive type
 *
 * @param {UserNotificationsReceiveTypesConfig} payload - Receive Type with its is-enabled state
 * @returns {Promise<{notifications: UserNotifications}>}
 */
export async function updateNotificationsReceiveType(payload) {
  return (await api.callOld(MUTATION_CHANGE_USER_NOTIFICATIONS_RECEIVE_TYPE, {
    input: payload,
  })).changeUserNotificationsReceiveType;
}

/**
 * Fetches user's bank cards for one-click payments
 *
 * @returns {Promise<Array<BankCard>>}
 */
export async function fetchBankCards() {
  return (await api.callOld(QUERY_BANK_CARDS)).me.bankCards || [];
}
