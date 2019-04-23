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
 * Enum for AuthError type argument
 * @typedef {string} AuthErrorType
 */
export const AuthErrorType = {
  LOGIN: 'LOGIN_ERROR',
  SIGNUP: 'SIGNUP_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Base error for auth module
 *
 * @class AuthError
 * @extends {Error}
 * @property {AuthError} type Error type, see AuthErrorType.
 * @property {any} [data] Additional data.
 */
export class AuthError extends Error {
  /**
   *Creates an instance of AuthError.
   * @param {string} message Error message.
   * @param {AuthErrorType} type Error type.
   * @param {any} data Additional data to pass. e.g. error from http library or response itself
   * @memberof AuthError
   */
  constructor(message, type, data = null) {
    super(message);

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    this.type = type;

    if (data) {
      this.data = data;
    }

    // Clip constructor invokation from stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Login user and get token.
 *
 * @param {string} email Email.
 * @param {string} password Password.
 * @returns {Promise<string>} Auth token.
 * @throws {AuthError} Authentication error occurred.
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
    throw new AuthError('Error while authenticating', AuthErrorType.LOGIN, e);
  }

  if (resp.status === HTTP_OK) {
    return resp.data.token;
  } else {
    throw new AuthError('Unknown response', AuthErrorType.UNKNOWN, { resp });
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
    throw new AuthError('Error while signing up', AuthErrorType.SIGNUP, e);
  }

  if (resp.status === HTTP_OK) {
    return resp.data.ok;
  } else {
    throw new AuthError('Unknown response', AuthErrorType.UNKNOWN, { resp });
  }
};
