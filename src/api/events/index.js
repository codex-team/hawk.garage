import {
  QUERY_EVENT
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
 * @param {string} projectId -
 * @param {string} eventId -
 * @return {Promise<TokensPair>} - Auth token
 */
export async function getEvent(projectId, eventId) {
  return (await api.call(QUERY_EVENT, { projectId, eventId })).event;
}
