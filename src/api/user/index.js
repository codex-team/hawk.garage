import {
  MUTATION_CHANGE_PASSWORD,
  MUTATION_LOGIN,
  MUTATION_REFRESH_TOKENS,
  MUTATION_SIGN_UP,
  MUTATION_RECOVER_PASSWORD,
  MUTATION_UPDATE_PROFILE,
  QUERY_CURRENT_USER
} from './queries';
import * as api from '../index.ts';

/**
 * @typedef {Object} TokensPair
 * @property {string} accessToken - user's access token
 * @property {string} refreshToken - user's refresh token for getting new tokens pair
 */

/**
 * Login user and get token
 *
 * @param {string} email - Email
 * @param {string} password - Password
 * @return {Promise<TokensPair>} - Auth token
 */
export async function login(email, password) {
  return (await api.call(MUTATION_LOGIN, { email, password })).login;
}

/**
 * Sign up by email and return status (true or false)
 *
 * @param {string} email - Email
 * @return {Promise<Boolean>} Response status
 */
export async function signUp(email) {
  return (await api.call(MUTATION_SIGN_UP, { email })).signUp;
}

/**
 * Recover password by email
 *
 * @param {string} email - user Email
 * @return {Promise<boolean>} Response status
 */
export async function recoverPassword(email) {
  return (await api.call(MUTATION_RECOVER_PASSWORD, { email })).resetPassword;
}

/**
 * Get new tokens pair by refreshToken
 *
 * @param {String} refreshToken - user's refresh token
 * @return {Promise<TokensPair>}
 */
export async function refreshTokens(refreshToken) {
  return (await api.call(MUTATION_REFRESH_TOKENS, { refreshToken }, undefined, { force: true })).refreshTokens;
}

/**
 * Get current user
 *
 * @return {Promise<User>}
 */
export async function fetchCurrentUser() {
  return (await api.call(QUERY_CURRENT_USER)).me;
}

/**
 * Update user profile
 *
 * @param {string} name
 * @param {string} email
 * @param {File} image
 * @returns {Promise<Boolean>}
 */
export async function updateProfile(name, email, image) {
  return (await api.call(MUTATION_UPDATE_PROFILE, { name, email }, { image })).updateProfile;
}

/**
 * Change user password
 *
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise<Boolean>}
 */
export async function changePassword(oldPassword, newPassword) {
  return (await api.call(MUTATION_CHANGE_PASSWORD, { oldPassword, newPassword })).changePassword;
}
