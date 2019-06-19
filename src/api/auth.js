import axios from 'axios';
import { MUTATION_LOGIN, MUTATION_SIGN_UP } from './mutations';
import { HTTP_OK } from './httpCodes';

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
  let resp;

  try {
    resp = await axios.post(API_ENDPOINT, {
      query: MUTATION_LOGIN,
      variables: {
        email,
        password
      }
    });
  } catch (e) {
    throw new Error(AUTH_ERROR.LOGIN);
  }

  if (resp.status === HTTP_OK) {
    return resp.data.login;
  } else {
    throw new Error(AUTH_ERROR.UNKNOWN);
  }
}

/**
 * Sign up by email and return status(ok)
 *
 * @param {string} email - Email
 * @returns {Promise<boolean>} Response status
 * @throws {Error} Authentication error occured
 */
export async function signUp(email) {
  let resp;

  try {
    console.log(MUTATION_SIGN_UP);
    resp = await axios.post(API_ENDPOINT, {
      query: MUTATION_SIGN_UP,
      variables: {
        email
      }
    });
    console.log(resp)
  } catch (e) {
    throw new Error(AUTH_ERROR.SIGN_UP);
  }

  if (resp.status === HTTP_OK) {
    return resp.data.signUp;
  } else {
    throw new Error(AUTH_ERROR.UNKNOWN);
  }
}
