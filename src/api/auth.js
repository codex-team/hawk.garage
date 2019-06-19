import axios from 'axios';
import { MUTATION_LOGIN, MUTATION_SIGN_UP } from './mutations';
import * as api from './index';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT =
  process.env.VUE_APP_API_ENDPOINT || 'http://localhost:4000/graphql';

/**
 * Enum of auth module errors
 * @enum {String}
 */
export const AUTH_ERROR = {
  LOGIN: 'An error occurred during the login attempt',
  SIGN_UP: 'An error occurred during the sign up attempt',
  UNKNOWN: 'Unknown error occurred'
};

/**
 * Login user and get token
 *
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Promise<string>} - Auth token
 * @throws {Error} Authentication error occurred
 */
export async function login(email, password) {
  return (await api.call(MUTATION_LOGIN, { email, password })).login;
}

/**
 * Sign up by email and return status(ok)
 *
 * @param {string} email - Email
 * @returns {Promise<boolean>} Response status
 * @throws {Error} Authentication error occured
 */
export async function signUp(email) {
  return (await api.call(MUTATION_SIGN_UP, { email })).signUp;
}
