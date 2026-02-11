/**
 * Intercepts API calls in demo mode and returns mock data
 *
 * Usage:
 * ```ts
 * export const fetchUser = withMockDemo(
 *   'fetchUser.mock',
 *   async function fetchUser(userId: string) {
 *     // Real API implementation
 *     return api.call(QUERY_USER, { userId });
 *   }
 * );
 * ```
 */

import { isDemoActive } from '@/composables/useDemo';

type MaybePromise<T> = T | Promise<T>;
type MockFactory<Fn extends (...args: any[]) => any> = (
  args: Parameters<Fn>
) => MaybePromise<Awaited<ReturnType<Fn>>>;

type MockSource<Fn extends (...args: any[]) => any> = MockFactory<Fn> | string;

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

function normalizeMockPath(mockPath: string): string {
  if (mockPath.startsWith('@/')) {
    return `/src/${mockPath.slice(2)}`;
  }

  return mockPath;
}

/**
 * Dynamically import mock module
 * @param mockPath - Full path to mock file
 */
async function loadMockModule(mockPath: string): Promise<any> {
  try {
    const normalizedPath = normalizeMockPath(mockPath);

    // Try different extensions
    const candidates = [
      normalizedPath,
      `${normalizedPath}.ts`,
      `${normalizedPath}.js`,
    ];

    for (const path of candidates) {
      try {
        return await import(/* @vite-ignore */ path);
      } catch {
        // Try next candidate
      }
    }

    throw new Error(`Failed to load mock module: ${mockPath}`);
  } catch (error) {
    throw new Error(`Mock module not found: ${mockPath}`);
  }
}

/**
 * Resolve mock path from short name to full module path
 * @param mockName - Mock file name or path
 */
function resolveMockPath(mockName: string): string {
  // If already starts with @/, return as is (will be resolved by Vite)
  if (mockName.startsWith('@/')) {
    return mockName;
  }

  // If already a full path starting with /src/, return as is
  if (mockName.startsWith('/src/')) {
    return mockName;
  }

  // If it's just a filename, we can't resolve it without preloading
  // This should not happen with the new explicit path approach
  throw new Error(`Mock path must be explicit (use @/ or /src/ prefix): ${mockName}`);
}

/**
 * Wraps API function to return mock data when demo mode is active
 * @param mockSource - Mock file name (string) or factory function
 * @param originalFunction - The real API implementation
 * @param options - Configuration options
 */
export function withMockDemo<Fn extends (...args: any[]) => any>(
  mockSource: MockSource<Fn>,
  originalFunction: Fn,
  options: MockOptions = {}
): Fn {
  const { enabled, debug = false } = options;

  return async function (this: any, ...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> {
    // Check if mocks are enabled
    const shouldUseMock
      = typeof enabled === 'function' ? enabled() : enabled ?? isDemoActive();

    // If not using mocks, call original function
    if (!shouldUseMock) {
      if (debug) {
        console.log(`[Demo Mock] ⏭️  Skipping mock for ${originalFunction.name} (demo mode inactive)`);
      }

      return originalFunction.apply(this, args);
    }

    if (debug) {
      console.log(`[Demo Mock] 🎭 Using mock for ${originalFunction.name}`, { args,
        mockSource });
    }

    try {
      let mockData: any;

      // If mockSource is a string, resolve and load it dynamically
      if (typeof mockSource === 'string') {
        const mockPath = resolveMockPath(mockSource);

        if (debug) {
          console.log(`[Demo Mock] 📂 Loading mock from: ${mockPath}`);
        }

        const mockModule = await loadMockModule(mockPath);
        const mockExport = mockModule.default;

        // Mock can be either a function (call it) or a value (use it directly)
        if (typeof mockExport === 'function') {
          mockData = await mockExport();
        } else {
          mockData = mockExport;
        }
      } else {
        // mockSource is a factory function
        mockData = await mockSource(args);
      }

      if (debug) {
        console.log(`[Demo Mock] ✅ Returned mock for ${originalFunction.name}`, mockData);
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
