/**
 * Intercepts API calls in demo mode and returns mock data
 *
 * Usage:
 * ```ts
 * export const fetchUser = withMockDemo(
 *   async function fetchUser(userId: string) {
 *     // Real API implementation
 *     return api.call(QUERY_USER, { userId });
 *   },
 *   '@/api/user/mocks/fetchUser.mock'
 * );
 * ```
 */

import { useDemo } from '@/composables/useDemo';

type MaybePromise<T> = T | Promise<T>;
type MockFactory<Fn extends (...args: any[]) => any> = (
  args: Parameters<Fn>
) => MaybePromise<Awaited<ReturnType<Fn>>>;

type MockSource<Fn extends (...args: any[]) => any> = MockFactory<Fn> | string;

/**
 * Dynamically import mock module
 * @param mockPath - Full path to mock file
 */
async function loadMockModule(mockPath: string): Promise<any> {
  try {
    return await import(/* @vite-ignore */ mockPath);
  } catch (error) {
    throw new Error(`Mock module not found: ${mockPath}`);
  }
}

/**
 * Wraps API function to return mock data when demo mode is active
 * @param originalFunction - The real API implementation
 * @param mockSource - Mock file path (string) or factory function
 */
export function withMockDemo<Fn extends (...args: any[]) => any>(
  originalFunction: Fn,
  mockSource: MockSource<Fn>
): Fn {
  return async function (this: any, ...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> {
    const { isDemoActive } = useDemo();

    if (!isDemoActive()) {
      return originalFunction.apply(this, args);
    }

    try {
      let mockData: any;

      // If mockSource is a string, resolve and load it dynamically
      if (typeof mockSource === 'string') {
        const mockModule = await loadMockModule(mockSource);
        const mockExport = mockModule.default;

        // Mock can be either a function (call it) or a value (use it directly)
        if (typeof mockExport === 'function') {
          mockData = await mockExport(...args);
        } else {
          mockData = mockExport;
        }
      } else {
        // mockSource is a factory function
        mockData = await mockSource(args);
      }

      return mockData;
    } catch (error) {
      console.error(
        `[Demo Mock] ❌ Error loading mock for ${originalFunction.name}, falling back to real API:`,
        error
      );

      // Fallback to real API on error
      return originalFunction.apply(this, args);
    }
  } as Fn;
}

/**
 * Backward compatibility: export constants
 */
export { DEMO_WORKSPACE_ID, DEMO_PROJECT_ID } from '@/api/mock-db';
