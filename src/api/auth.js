import axios from 'axios';
import { MUTATION_LOGIN, MUTATION_SIGNUP } from './queries';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT =
  process.env.VUE_API_ENDPOINT || 'http://localhost:3000/graphql';

/**
 * Base error for auth module
 *
 * @class AuthError
 * @extends {Error}
 */
class AuthError extends Error {}

/**
 * Login user and get token.
 *
 * @param {string} email Email.
 * @param {string} password Password.
 * @returns {Promise<string>} Auth token.
 * @throws {AuthError} Authentication error occured.
 */
const login = async (email, password) => {
  let resp;

  try {
    resp = await axios.post(API_ENDPOINT, {
      query: MUTATION_LOGIN,
      variables: {
        login: email,
        password
      }
    });
  } catch (e) {
    throw new AuthError('Error while authenticating');
  }

  if (resp.status === 200) {
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
const signUp = async email => {
  let resp;

  try {
    resp = await axios.post(API_ENDPOINT, {
      query: MUTATION_SIGNUP,
      variables: {
        email
      }
    });
  } catch (e) {
    throw new AuthError('Error while signing up');
  }

  if (resp.status === 200) {
    return resp.data.ok;
  } else {
    throw new AuthError('Unknown response');
  }
};

export default {
  login,
  signUp
};
