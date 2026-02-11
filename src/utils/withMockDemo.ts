/**
 * @withMockDemo - Intercepts API calls in demo mode and returns mock data
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

import store from '@/store';

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

/**
 * Pre-load all mock modules using Vite's import.meta.glob
 */
const mockModuleLoaders = import.meta.glob('/src/api/**/mocks/*.mock.{ts,js}');

/**
 * Check if demo mode is active in store
 */
function isDemoModeActive(): boolean {
  try {
    // Check if current path is /demo or /demo/*
    if (typeof window !== 'undefined' && window.location) {
      const isDemoPath = window.location.pathname === '/demo' || window.location.pathname.startsWith('/demo/');
      if (isDemoPath) {
        return true;
      }
    }

    return store?.state?.demo?.isActive ?? false;
  } catch (error) {
    console.warn('[withMockDemo] Could not access store, demo mode disabled:', error);
    return false;
  }
}

/**
 * Resolve mock path from short name to full glob path
 */
function resolveMockPath(mockName: string): string | null {
  // If already a full path starting with /src/, check if it exists
  if (mockName.startsWith('/src/')) {
    return mockModuleLoaders[mockName] ? mockName : null;
  }

  // If starts with @/, convert to /src/ and check
  if (mockName.startsWith('@/')) {
    const normalized = mockName.replace(/^@\//, '/src/');
    return mockModuleLoaders[normalized] ? normalized : null;
  }

  // Build list of candidates with different extensions
  const candidates = new Set<string>();

  // Add the name as-is
  candidates.add(mockName);

  // If doesn't end with .mock, add variants with .mock suffix
  if (!mockName.endsWith('.mock')) {
    candidates.add(`${mockName}.mock`);
    candidates.add(`${mockName}.mock.ts`);
    candidates.add(`${mockName}.mock.js`);
  } else {
    // If already ends with .mock, just add file extensions
    candidates.add(`${mockName}.ts`);
    candidates.add(`${mockName}.js`);
  }

  // Search in all loaded mock modules
  for (const key of Object.keys(mockModuleLoaders)) {
    for (const candidate of candidates) {
      if (key.endsWith(`/mocks/${candidate}`)) {
        return key;
      }
    }
  }

  return null;
}

/**
 * Wraps API function to return mock data when demo mode is active
 *
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
    const shouldUseMock =
      typeof enabled === 'function' ? enabled() : enabled ?? isDemoModeActive();

    // If not using mocks, call original function
    if (!shouldUseMock) {
      if (debug) {
        console.log(`[Demo Mock] ⏭️  Skipping mock for ${originalFunction.name} (demo mode inactive)`);
      }
      return originalFunction.apply(this, args);
    }

    if (debug) {
      console.log(`[Demo Mock] 🎭 Using mock for ${originalFunction.name}`, { args, mockSource });
    }

    try {
      let mockData: any;

      // If mockSource is a string, resolve and load it
      if (typeof mockSource === 'string') {
        const mockPath = resolveMockPath(mockSource);
        if (!mockPath) {
          throw new Error(`Mock file not found: ${mockSource}`);
        }

        if (debug) {
          console.log(`[Demo Mock] 📂 Loading mock from: ${mockPath}`);
        }

        const mockModule = await mockModuleLoaders[mockPath]();
        const mockExport = (mockModule as any).default;

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
