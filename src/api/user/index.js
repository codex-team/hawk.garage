import {
  MUTATION_LOGIN,
  MUTATION_REFRESH_TOKENS,
  MUTATION_SIGN_UP,
  MUTATION_UPDATE_PROFILE,
  QUERY_CURRENT_USER
} from './queries';
import * as api from '../index';

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
 * Get new tokens pair by refreshToken
 *
 * @param {String} refreshToken - user's refresh token
 * @return {Promise<TokensPair>}
 */
export async function refreshTokens(refreshToken) {
  return (await api.call(MUTATION_REFRESH_TOKENS, { refreshToken })).refreshTokens;
}

/**
 * Get current user
 *
 * @returns {Promise<module.exports.Query.me>}
 */
export async function fetchCurrentUser() {
  return (await api.call(QUERY_CURRENT_USER)).me;
}

/**
 * Update user profile
 *
 * @param {string} name
 * @param {string} email
 * @returns {Promise<Boolean>}
 */
export async function updateProfile(name, email) {
  return (await api.call(MUTATION_UPDATE_PROFILE, { name, email })).updateProfile;
}
