import type { Breadcrumb } from '@hawk.so/types';

/**
 * HTTP status codes constants
 */
const HTTP_STATUS_SUCCESS_MIN = 200;
const HTTP_STATUS_SUCCESS_MAX = 299;
const HTTP_STATUS_CLIENT_ERROR_MIN = 400;
const HTTP_STATUS_CLIENT_ERROR_MAX = 499;
const HTTP_STATUS_SERVER_ERROR_MIN = 500;
const HTTP_STATUS_SERVER_ERROR_MAX = 599;

/**
 * Returns CSS variable name for breadcrumb color based on type and status code
 * @param breadcrumb - Breadcrumb object
 * @returns CSS variable name (e.g., '--color-indicator-positive')
 */
export function getBreadcrumbColor(breadcrumb: Breadcrumb): string {
  /**
   * Special handling for request type with status codes
   */
  if (breadcrumb.type === 'request') {
    const statusCode = breadcrumb.data?.statusCode as number | undefined;
    const message = breadcrumb.message ?? '';

    /**
     * Network failure: statusCode 0 or [FAIL] in message
     */
    if (statusCode === 0 || message.includes('[FAIL]')) {
      return '--color-indicator-critical';
    }

    /**
     * Success: 2xx status codes
     */
    if (typeof statusCode === 'number' && statusCode >= HTTP_STATUS_SUCCESS_MIN && statusCode <= HTTP_STATUS_SUCCESS_MAX) {
      return '--color-indicator-positive';
    }

    /**
     * Client error: 4xx status codes
     */
    if (typeof statusCode === 'number' && statusCode >= HTTP_STATUS_CLIENT_ERROR_MIN && statusCode <= HTTP_STATUS_CLIENT_ERROR_MAX) {
      return '--color-indicator-critical';
    }

    /**
     * Server error: 5xx status codes
     */
    if (typeof statusCode === 'number' && statusCode >= HTTP_STATUS_SERVER_ERROR_MIN && statusCode <= HTTP_STATUS_SERVER_ERROR_MAX) {
      return '--color-indicator-critical';
    }

    return '--color-indicator-warning';
  }

  /**
   * Type-based colors
   */
  switch (breadcrumb.type) {
    case 'error':
      return '--color-indicator-critical';
    case 'navigation':
      return '--color-breadcrumb-navigation';
    case 'ui':
      return '--color-breadcrumb-ui';
    case 'logic':
      return '--color-text-highlighted';
    default:
      return '--color-breadcrumb-default';
  }
}
