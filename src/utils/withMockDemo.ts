/**
 * @withMockDemo Decorator
 *
 * Intercepts API calls in demo mode and returns mock data instead of making real requests
 *
 * Usage:
 * ```ts
 * export const fetchUser = withMockDemo(
 *   () => import('./mocks/fetchUser.mock').then(m => m.default)
 * )(async function fetchUser(userId: string) {
 *   // Real API implementation
 *   return api.call(QUERY_USER, { userId });
 * });
 * ```
 */

import store from '@/store';

type MaybePromise<T> = T | Promise<T>;
type MockFactory<Fn extends (...args: any[]) => any> = (
  args: Parameters<Fn>
) => MaybePromise<Awaited<ReturnType<Fn>>>;

/**
 * Options for mock decorator
 */
export interface MockOptions {
  /**
   * Enable/disable mocks (default: checks demo state)
   */
  enabled?: boolean | (() => boolean);

  /**
   * Custom logging
   */
  debug?: boolean;
}

/**
 * Check if demo mode is active in store
 */
function isDemoModeActive(): boolean {
  try {
    return store?.state?.demo?.isActive ?? false;
  } catch (error) {
    console.warn('[withMockDemo] Could not access store, demo mode disabled:', error);
    return false;
  }
}

/**
 * Decorator that replaces API calls with mock data when demo mode is active
 *
 * @param mockFactory - Lazy import function that returns mock data
 * @param options - Configuration options
 */
export function withMockDemo<Fn extends (...args: any[]) => any>(
  mockFactory: MockFactory<Fn>,
  options: MockOptions = {}
) {
  const { enabled, debug = false } = options;

  return function decorator(original: Fn, _context?: any) {
    // If not a function, return as-is
    if (typeof original !== 'function') return original;

    return async function (this: any, ...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> {
      // Check if mocks are enabled
      const shouldUseMock =
        typeof enabled === 'function' ? enabled() : enabled ?? isDemoModeActive();

      // If not using mocks, call original function
      if (!shouldUseMock) {
        return original.apply(this, args);
      }

      if (debug) {
        console.log(`[Demo Mock] 🎭 Using mock for ${original.name}`, { args });
      }

      try {
        // Get mock data from factory
        const mockData = await mockFactory(args);

        // If mock is a function, call it with arguments
        const result = typeof mockData === 'function' ? await mockData(...args) : mockData;

        if (debug) {
          console.log(`[Demo Mock] ✅ Returned mock for ${original.name}`, result);
        }

        return result;
      } catch (error) {
        console.error(
          `[Demo Mock] ❌ Error loading mock for ${original.name}, falling back to real API:`,
          error
        );
        // Fallback to real API on error
        return original.apply(this, args);
      }
    } as Fn;
  };
}

/**
 * Backward compatibility: export constants
 */
export { DEMO_WORKSPACE_ID, DEMO_PROJECT_ID } from '@/api/mock-db';
