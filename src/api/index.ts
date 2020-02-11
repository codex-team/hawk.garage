import axios, { AxiosResponse } from 'axios';
import { prepareFormData } from '@/api/utils';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT: string = process.env.VUE_APP_API_ENDPOINT;

/**
 * A promise that will be resolved after the initialization request
 */
let blockingRequest: Promise<AxiosResponse>;

/**
 * If contains Promise, request for token refreshing was already send and need wait for it
 */
let tokenRefreshingRequest: Promise<string> | null;

/**
 * Settings that can be passed in api.call() method (see below)
 */
interface ApiCallSettings {
  /**
   * If true, other requests will be waiting for resolving this query
   */
  initial?: boolean;

  /**
   * If true, this request will be performed despite of initial query state
   */
  force?: boolean;
}

/**
 * Makes request to API
 * @param {String} request - request to send
 * @param {Object} [variables] - request variables
 * @param {Object} [files] - files to upload
 * @param {ApiCallSettings} [settings] - settings for call method
 * @return {Promise<*>} - request data
 */
export async function call(
  request: string,
  variables?: any,
  files?: {[name: string]: File | undefined},
  { initial = false, force = false }: ApiCallSettings = {}
): Promise<any> {
  let promise: Promise<AxiosResponse>;

  if (files && Object.values(files).filter(Boolean).length) {
    const formData = prepareFormData(request, variables, files);

    promise = axios.post(API_ENDPOINT, formData);
  } else {
    promise = axios.post(API_ENDPOINT, {
      query: request,
      variables
    });
  }

  if (initial) {
    blockingRequest = promise;
  }

  let response;

  if (initial || force) {
    response = await promise;
  } else {
    response = (await Promise.all([blockingRequest, promise]))[1];
  }

  if (response.data.errors) {
    throw response.data.errors[0];
  }
  return response.data.data;
}

/**
 * Set or remove auth token in request header
 * @param {String|null} accessToken - user's access token. If null, token will be deleted from header
 */
export function setAuthToken(accessToken: string | null): void {
  if (!accessToken) {
    delete axios.defaults.headers.common.Authorization;
  } else {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
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

/**
 * Handlers for API module for getting necessary data or calling function on error occurrence
 */
interface ApiModuleHandlers {
  /**
   * Called when a tokens pair needs to be updated
   * @return {string} access tokens
   */
  onTokenExpired(): Promise<string>;

  /**
   * Called when auth failed
   */
  onAuthError(): void;
}

/**
 * Setup handlers for API module, for example, functions for refreshing token
 * @param {ApiModuleHandlers} eventsHandlers - object with handlers
 */
export function setupApiModuleHandlers(eventsHandlers: ApiModuleHandlers) {
  /**
   * Interceptors that handles the error of expired tokens
   */
  axios.interceptors.response.use(
    /**
     * Interceptor handler
     * @param {AxiosResponse} response - axios response object
     * @return {Promise<AxiosResponse>} - processed request
     */
    async (response: AxiosResponse): Promise<AxiosResponse> => {
      const errors = response.data.errors;
      const isTokenExpiredError = errors && errors[0].extensions.code === errorCodes.ACCESS_TOKEN_EXPIRED_ERROR;

      if (!errors || !isTokenExpiredError) {
        return response;
      }

      const originalRequest = response.config;

      try {
        /**
         * If there is a pending request for token refreshing then await it
         * Else send new request
         */
        if (!tokenRefreshingRequest) {
          tokenRefreshingRequest = eventsHandlers.onTokenExpired();
        }

        const newAccessToken = await tokenRefreshingRequest;

        tokenRefreshingRequest = null;

        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        return axios(originalRequest);
      } catch (error) {
        console.error(error);
        eventsHandlers.onAuthError();
        return response;
      }
    }
  );
}
