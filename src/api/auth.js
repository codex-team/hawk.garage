import axios from 'axios';
import { MUTATION_LOGIN, MUTATION_SIGN_UP } from './mutations';
import { HTTP_OK } from './httpCodes';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT =
  process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/graphql';

/**
 * Mock api? true/false
 */
const MOCK = process.env.VUE_APP_API_MOCK;

/**
 * Enum of auth module errors
 * @enum {String}
 */
export const AUTH_ERROR = {
  LOGIN: 'LOGIN_ERROR',
  SIGN_UP: 'SIGN_UP_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Login user and get token
 *
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Promise<string>} - Auth token
 * @throws {Error} Authentication error occurred
 */
export const login = async (email, password) => {
  let resp;

  try {
    if (!MOCK) {
      resp = await axios.post(API_ENDPOINT, {
        query: MUTATION_LOGIN,
        variables: {
          email,
          password
        }
      });
    } else {
      resp = {
        status: HTTP_OK,
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU1NDU2NDU4OH0.DLExJXDZc3FSfFr_GbxjxBVyxnFFM5ehryy8vPQ_QO8'
        }
      };
    }
  } catch (e) {
    throw new Error(AUTH_ERROR.LOGIN);
  }

  if (resp.status === HTTP_OK) {
    return resp.data.token;
  } else {
    throw new Error(AUTH_ERROR.UNKNOWN);
  }
};

/**
 * Sign up by email and return status(ok)
 *
 * @param {string} email - Email
 * @returns {Promise<boolean>} Response status
 * @throws {Error} Authentication error occured
 */
export const signUp = async email => {
  let resp;

  try {
    if (!MOCK) {
      resp = await axios.post(API_ENDPOINT, {
        query: MUTATION_SIGN_UP,
        variables: {
          email
        }
      });
    } else {
      resp = {
        status: HTTP_OK,
        data: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU1NDU2NDU4OH0.DLExJXDZc3FSfFr_GbxjxBVyxnFFM5ehryy8vPQ_QO8'
        }
      };
    }
  } catch (e) {
    throw new Error(AUTH_ERROR.SIGN_UP);
  }

  if (resp.status === HTTP_OK) {
    return resp.data.ok;
  } else {
    throw new Error(AUTH_ERROR.UNKNOWN);
  }
};
