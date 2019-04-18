import axios from 'axios';
// import getMutation from './mutations';
import { MUTATION_LOGIN, MUTATION_SIGNUP } from './mutations';
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
 * Base error for auth module
 *
 * @class AuthError
 * @extends {Error}
 */
export class AuthError extends Error {}

/**
 * Login user and get token.
 *
 * @param {string} email Email.
 * @param {string} password Password.
 * @returns {Promise<string>} Auth token.
 * @throws {AuthError} Authentication error occured.
 */
export const login = async (email, password) => {
  let resp;
  console.log(MUTATION_LOGIN);
  try {
    if (!MOCK) {
      resp = await axios.post(API_ENDPOINT, {
        query: MUTATION_LOGIN,
        variables: {
          login: email,
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
    throw new AuthError('Error while authenticating');
  }

  if (resp.status === HTTP_OK) {
    return resp.data.token;
  } else {
    throw new AuthError('Unknown response');
  }
};

/**
 * Sign up by email and return status(ok)
 *
 * @param {string} email Email.
 * @returns {Promise<boolean>} Response status.
 * @throws {AuthError} Authentication error occured.
 */
export const signUp = async email => {
  let resp;

  try {
    if (!MOCK) {
      resp = await axios.post(API_ENDPOINT, {
        query: MUTATION_SIGNUP,
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
    throw new AuthError('Error while signing up');
  }

  if (resp.status === HTTP_OK) {
    return resp.data.ok;
  } else {
    throw new AuthError('Unknown response');
  }
};
