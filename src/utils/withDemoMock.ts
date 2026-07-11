/**
 * Intercepts API calls in demo mode and returns mock data
 *
 * Usage:
 * ```ts
 * export const fetchUser = withDemoMock(
 *   async function fetchUser(userId: string) {
 *     // Real API implementation
 *     return api.call(QUERY_USER, { userId });
 *   },
 *   '/src/api/user/mocks/fetchUser.mock.ts'
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
 * Statically discoverable mock registry so Vite can code-split and include mocks in the bundle.
 * Runtime `import(variable)` with `@vite-ignore` would break demo mode in production builds.
 */
const mockModules = import.meta.glob('/src/api/**/mocks/**/*.{ts,js}');

/**
 * Load mock module by path used in withDemoMock call sites (e.g. `/src/api/.../foo.mock.ts`)
 * @param mockPath - Full path to mock file
 */
async function loadMockModule(mockPath: string): Promise<any> {
  const loader = mockModules[mockPath];

  if (!loader) {
    throw new Error(`Mock module not found: ${mockPath}`);
  }

  return await loader();
}

/**
 * Wraps API function to return mock data when demo mode is active
 * @param originalFunction - The real API implementation
 * @param mockSource - Mock file path (string) or factory function
 */
export function withDemoMock<Fn extends (...args: any[]) => any>(
  originalFunction: Fn,
  mockSource: MockSource<Fn>
): Fn {
  return async function (this: any, ...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> {
    const { isDemoActive } = useDemo();

    if (!isDemoActive.value) {
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
