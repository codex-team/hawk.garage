import axios from 'axios';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT =
  process.env.VUE_APP_API_ENDPOINT || 'http://localhost:4000/graphql';

export async function call(requestName, variables) {
  const response = await axios.post(API_ENDPOINT, {
    query: requestName,
    variables
  });

  if (response.data.errors) throw response.data.errors;
  return response.data.data;
}

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
