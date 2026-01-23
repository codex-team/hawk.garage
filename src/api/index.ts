import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { prepareFormData } from '@/api/utils';
import type { APIResponse } from '../types/api';
import { useErrorTracker } from '@/hawk';

/**
 * Hawk API endpoint URL
 */
export const API_ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT || '';

/**
 * A promise that will be resolved after the initialization request
 */
let blockingRequest: Promise<AxiosResponse>;

/**
 * If contains Promise, request for token refreshing was already send and need wait for it
 */
let tokenRefreshingRequest: Promise<string> | null;

/**
 * Error tracking composable
 */
const { track } = useErrorTracker();

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
  location: { line: number;
    column: number; }[];

  /**
   * Error code and stacktrace
   */
  extensions: { code: string;
    exception: { stacktrace: string[] }; };
}

/**
 * Print API error to the console
 * @param error - GraphQL error
 * @param response - Response given
 * @param request - GraphQL request that was sent
 * @param variables - request variables
 */
function printApiError(error: GraphQLError, response: { data: Record<string, unknown> }, request: string, variables?: Record<string, unknown>): void {
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
 * Settings that can be passed in api.callOld() method (see below)
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
   * @deprecated
   */
  allowErrors?: boolean;
}

/**
 * Makes request to API (old)
 * @deprecated GraphQL can return response along with errors.
 *             Previously, we hardcoded only response (for ex. api.call('getUser').getUser) — and lose errors data
 *             Later we added 'allowErrors' flag for new requests.
 *             And for now, we have the new api.call() method that supports errors by default. Use it instead of this.
 * @param request - request to send
 * @param [variables] - request variables
 * @param [files] - files to upload
 * @param [settings] - settings for call method
 * @returns - request data
 */
export async function callOld(
  request: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>,
  files?: { [name: string]: File | undefined },
  { initial = false, force = false, allowErrors = false }: ApiCallSettings = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  let promise: Promise<AxiosResponse>;

  if (files && Object.values(files).filter(Boolean).length) {
    const formData = prepareFormData(request, variables, files);

    promise = axios.post(API_ENDPOINT + '/graphql', formData);
  } else {
    promise = axios.post(API_ENDPOINT + '/graphql', {
      query: request,
      variables,
    });
  }

  if (initial) {
    blockingRequest = promise;
  }

  let response;

  try { // handle axios errors
    if (initial || force) {
      response = await promise;
    } else {
      response = (await Promise.all([blockingRequest, promise]))[1];
    }

    if (response.data.errors) {
      response.data.errors.forEach((error) => {
        /**
         * Send error to Hawk
         */
        track(new Error(error.message), {
          Request: request,
          'Error Path': error.path,
          Variables: variables ?? {},
          'Response Data': response.data.data,
        });

        printApiError(error, response.data, request, variables);
      });
    }

    /**
     * For now (Apr 10, 2020) all previous code await to get only data
     * so new request will pass allowErrors=true and get both errors and data
     * @todo refactor old requests same way
     */
    if (allowErrors) {
      return response.data;
    } else {
      // console.warn('Api call in old format. Should be refactored to support errors', request);
    }

    /**
     * @deprecated old format. See method jsdoc
     */
    return response.data.data;
  } catch (error) {
    console.error('API Request Error', error);

    track(error as Error, {
      Request: request,
      Variables: variables ?? {},
      'Response Data': response?.data.data,
    });

    throw error;
  }
}

/**
 * Makes request to API
 * @param request - request to send
 * @param [variables] - request variables
 * @param [files] - files to upload
 * @param [settings] - settings for call method
 * @returns - request data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function call<T = any>(
  request: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>,
  files?: { [name: string]: File | undefined },
  { initial = false, force = false, allowErrors = false }: ApiCallSettings = {}
): Promise<APIResponse<T>> {
  const response = await callOld(request, variables, files, Object.assign({
    initial,
    force,
  }, {
    allowErrors: true, // forcefully set this flag. When all the requests will be refactored from api.callOld() to api.call(), remove this flag.
  }));

  /**
   * Token refreshing is done in response interceptor. If refreshing fails, special
   * flag is set and response is returned as is to the caller.
   *
   * It helps not to throw original "access token expired" error.
   */
  if (response._apiFlags && response._apiFlags.authError) {
    return response as APIResponse<T>;
  }

  /**
   * Response can contain errors.
   * Throw such errors to the Vue component to display them for user
   *
   * Note from 2024-04-10:
   *  - Now we have try-catch block components, since errors are thrown from the API module
   *  - But it would be more safe to not throw errors from the API module, but return them in the response and then handle them in store or component.
   *  - Refactoring steps: (@todo)
   *     1. Rewrire all requests to use api.call() instead of api.callOld()
   *     2. Get rid of allowErrors flag form the api.callOld() method
   *     3. Provide a way to handle errors in the store
   *     4. Review all try/catch statements in the components and remove them
   * - For a temporary solution, we explicitly pass allowErrors=true when method is ready to receive errors as well as data
   */
  if (response.errors && response.errors.length && allowErrors === false) {
    response.errors.forEach((error) => {
      const err = new Error(error.message) as Error & { extensions?: Record<string, unknown> };

      /**
       * Preserve extensions from GraphQL error
       * (e.g., for SSO enforcement, see /api/src/resolvers/user.ts@login)
       */
      if (error.extensions) {
        err.extensions = error.extensions as Record<string, unknown>;
      }

      throw err;
    });
  }

  return response as APIResponse<T>;
}

/**
 * Set or remove auth token in request header
 * @param accessToken - user's access token. If null, token will be deleted from header
 */
export function setAuthToken(accessToken: string | null): void {
  if (!accessToken) {
    delete axios.defaults.headers.common.Authorization;
  } else {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
}

/**
 * REST API request options
 */
interface RestRequestOptions {
  /**
   * HTTP method (GET, POST, PUT, DELETE, etc.)
   */
  method?: string;

  /**
   * Request body (will be JSON stringified)
   */
  body?: Record<string, unknown>;

  /**
   * Additional headers
   */
  headers?: Record<string, string>;
}

/**
 * Makes REST API request (non-GraphQL)
 * Uses axios with configured interceptors and auth token
 *
 * @param url - REST endpoint URL (relative to API_ENDPOINT or absolute)
 * @param options - request options (method, body, headers)
 * @returns Promise with response data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callRest<T = any>(url: string, options: RestRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  /**
   * Use absolute URL if provided, otherwise prepend API_ENDPOINT
   */
  const fullUrl = url.startsWith('http') ? url : `${API_ENDPOINT}${url}`;

  try {
    const response = await axios({
      method,
      url: fullUrl,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      } as Record<string, string>,
    });

    return response.data;
  } catch (error) {
    /**
     * Handle axios errors
     */
    if (axios.isAxiosError(error)) {
      /**
       * Try to extract error message from response
       */
      const errorMessage = error.response?.data?.error || error.message || 'Request failed';

      const apiError = new Error(errorMessage) as Error & { status?: number; response?: unknown };

      apiError.status = error.response?.status;
      apiError.response = error.response?.data;

      /**
       * Track error
       */
      track(apiError, {
        URL: fullUrl,
        Method: method,
        Body: body || {},
        'Response Data': error.response?.data || {},
      } as any);

      throw apiError;
    }

    /**
     * Re-throw non-axios errors
     */
    track(error as Error, {
      URL: fullUrl,
      Method: method,
      Body: body || {},
    } as any);

    throw error;
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

  /**
   * Error throws when user's refresh token is expired or invalid
   */
  UNAUTHENTICATED: 'UNAUTHENTICATED',
};

/**
 * Handlers for API module for getting necessary data or calling function on error occurrence
 */
interface ApiModuleHandlers {
  /**
   * Called when a tokens pair needs to be updated
   * @returns access tokens
   */
  onTokenExpired(): Promise<string>;

  /**
   * Called when auth failed
   */
  onAuthError(): void;
}

/**
 * Setup handlers for API module, for example, functions for refreshing token
 * @param eventsHandlers - object with handlers
 */
export function setupApiModuleHandlers(eventsHandlers: ApiModuleHandlers): void {
  /**
   * Interceptors that handles the error of expired tokens
   */
  axios.interceptors.response.use(
    /**
     * Interceptor handler
     * @param response - axios response object
     * @returns - processed request
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

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        } else {
          originalRequest.headers = {
            Authorization: 'Bearer ' + newAccessToken,
          };
        }

        return axios(originalRequest);
      } catch (error) {
        tokenRefreshingRequest = null;

        console.error(error);

        eventsHandlers.onAuthError();

        response.data._apiFlags = {
          authError: true,
        };

        return response;
      }
    }
  );
}
