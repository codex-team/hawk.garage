import axios from 'axios';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT =
  process.env.VUE_APP_API_ENDPOINT || 'http://localhost:4000/graphql';

/**
 * Makes request to API
 * @param {String} request - request to send
 * @param {Object} [variables] - request variables
 * @return {Promise<*>} - request data
 */
export async function call(request, variables) {
  const response = await axios.post(API_ENDPOINT, {
    query: request,
    variables
  });

  if (response.data.errors) throw response.data.errors[0];
  return response.data.data;
}

/**
 * Set or remove auth token in request header
 * @param {String|null} accessToken - user's access token. If null, token will be deleted from header
 */
export function setAuthToken(accessToken) {
  if (!accessToken) return delete axios.defaults.headers.common['Authorization'];
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

/**
 * Hawk API error codes
 */
export const errorCodes = {
  /**
   * Auth-related errors
   */

  /**
   * Error throws when user send expired access token and tries to access private resources
   */
  ACCESS_TOKEN_EXPIRED_ERROR: 'ACCESS_TOKEN_EXPIRED_ERROR'
};
