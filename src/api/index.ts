import axios, { AxiosResponse } from 'axios';
import { prepareFormData } from '@/api/utils';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT: string = process.env.VUE_APP_API_ENDPOINT;
const API_SERVER: string = process.env.VUE_APP_REST_SERVER;

/**
 * A promise that will be resolved after the initialization request
 */
let blockingRequest: Promise<AxiosResponse>;

/**
 * If contains Promise, request for token refreshing was already send and need wait for it
 */
let tokenRefreshingRequest: Promise<string> | null;

/**
 * Describe format of the GraphQL API error item
 */
interface GraphQLError {
  /**
   * Error text message
   */
  message: string;

  /**
   * Where error occurred - path to file
   */
  path: string[];
  /**
   * Where error occurred - line and col
   */
  location: {line: number; column: number}[];

  /**
   * Error code and stacktrace
   */
  extensions: {code: string; exception: {stacktrace: string[]}};
}

/**
 * Print API error to the console
 *
 * @param error - GraphQL error
 * @param response - Response given
 * @param request - GraphQL request that was sent
 * @param variables - request variables
 */
function printApiError(error: GraphQLError, response: {data: object}, request: string, variables?: object): void {
  console.log('\n');
  console.group('❌ API error ---> ' + error.message);
  console.groupCollapsed('┕ Error details');
  console.error(error);
  console.groupEnd();
  console.groupCollapsed('┕ Original request');
  console.log(request.trim());
  console.log('Variables', variables);
  console.groupEnd();
  console.groupCollapsed('┕ Data returned');
  console.log(response ? response.data : '—');
  console.groupEnd();
  console.groupEnd();
  console.log('\n');
}

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

  /**
   * If true, request can return both data and errors object to handle them manually
   */
  allowErrors?: boolean;
}

/**
 * Makes request to API
 *
 * @param {string} request - request to send
 * @param {object} [variables] - request variables
 * @param {object} [files] - files to upload
 * @param {ApiCallSettings} [settings] - settings for call method
 * @returns {Promise<*>} - request data
 */
export async function call(
  request: string,
  variables?: object,
  files?: {[name: string]: File | undefined},
  { initial = false, force = false, allowErrors = false }: ApiCallSettings = {}
  // eslint-disable-next-line
): Promise<any> {
  let promise: Promise<AxiosResponse>;

  if (files && Object.values(files).filter(Boolean).length) {
    const formData = prepareFormData(request, variables, files);

    promise = axios.post(API_ENDPOINT, formData);
  } else {
    promise = axios.post(API_ENDPOINT, {
      query: request,
      variables,
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
    response.data.errors.forEach(error => {
      printApiError(error, response.data, request, variables);
    });
  }

  /**
   * For now (Apr 10, 2020) all previous code await to get only data
   * so new request will pass allowErrors=true and get both errors and data
   *
   * @todo refactor old requests same way
   */
  if (allowErrors) {
    return response.data;
  }

  return response.data.data;
}

/**
 * Set or remove auth token in request header
 *
 * @param {string|null} accessToken - user's access token. If null, token will be deleted from header
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
  ACCESS_TOKEN_EXPIRED_ERROR: 'ACCESS_TOKEN_EXPIRED_ERROR',
};

/**
 * Handlers for API module for getting necessary data or calling function on error occurrence
 */
interface ApiModuleHandlers {
  /**
   * Called when a tokens pair needs to be updated
   *
   * @returns {string} access tokens
   */
  onTokenExpired(): Promise<string>;

  /**
   * Called when auth failed
   */
  onAuthError(): void;
}

/**
 * Setup handlers for API module, for example, functions for refreshing token
 *
 * @param {ApiModuleHandlers} eventsHandlers - object with handlers
 */
export function setupApiModuleHandlers(eventsHandlers: ApiModuleHandlers): void {
  /**
   * Interceptors that handles the error of expired tokens
   */
  axios.interceptors.response.use(
    /**
     * Interceptor handler
     *
     * @param {AxiosResponse} response - axios response object
     * @returns {Promise<AxiosResponse>} - processed request
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
