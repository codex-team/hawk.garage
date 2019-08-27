import { MUTATION_LOGIN, MUTATION_REFRESH_TOKENS, MUTATION_SIGN_UP } from './queries';
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
 * @returns {Promise<TokensPair>} - Auth token
 */
export async function login(email, password) {
  return (await api.call(MUTATION_LOGIN, { email, password })).login;
}

/**
 * Sign up by email and return status (true or false)
 *
 * @param {string} email - Email
 * @returns {Promise<Boolean>} Response status
 */
export async function signUp(email) {
  return (await api.call(MUTATION_SIGN_UP, { email })).signUp;
}

/**
 * Get new tokens pair by refreshToken
 * @param {String} refreshToken - user's refresh token
 * @return {Promise<TokensPair>}
 */
export async function refreshTokens(refreshToken) {
  return (await api.call(MUTATION_REFRESH_TOKENS, { refreshToken }, { force: true })).refreshTokens;
}
