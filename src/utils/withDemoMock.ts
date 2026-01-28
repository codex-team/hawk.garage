/**
 * Demo workspace and project IDs used for mocking
 */
export const DEMO_PROJECT_ID = '6215743cf3ff6b80215cb183';
export const DEMO_WORKSPACE_ID = '6213b6a01e6281087467cc7a';

/**
 * Global flag to force demo mode (for development/testing without server)
 * Set to true to always use mock data instead of real API
 */
export let FORCE_DEMO_MODE = false;

/**
 * Enable demo mode globally
 */
export function enableDemoMode() {
  FORCE_DEMO_MODE = true;
  console.log('[Demo Mode] Enabled - all API calls will use mock data');
}

/**
 * Disable demo mode globally
 */
export function disableDemoMode() {
  FORCE_DEMO_MODE = false;
  console.log('[Demo Mode] Disabled - API calls will use real server');
}

type MaybePromise<T> = T | Promise<T>;

/**
 * Options for the demo mock decorator
 */
export type DemoMockOptions<Fn extends (...args: any[]) => any> = {
  /**
   * How to extract projectId/workspaceId from function arguments.
   * Default: projectId = args[0]
   */
  extract?: (args: Parameters<Fn>) => { projectId?: string; workspaceId?: string };

  /**
   * Enable/disable mocks (e.g., disable in production)
   * Default: true
   */
  enabled?: boolean | (() => boolean);

  /**
   * Transform the mock data before returning
   * Default: return mock as-is
   */
  mapMock?: (mock: any, ctx: DemoContext<Fn>) => any;
};

/**
 * Context passed to mock factory and mapMock
 */
export type DemoContext<Fn extends (...args: any[]) => any> = {
  args: Parameters<Fn>;
  projectId?: string;
  workspaceId?: string;
  original: Fn;
};

/**
 * Decorator that intercepts API calls for demo workspace/project and returns mock data instead
 *
 * @example
 * ```ts
 * @withDemoMock(
 *   () => import('./fetchData.mock').then(m => m.default),
 *   { extract: (args) => ({ projectId: args[0] }) }
 * )
 * export async function fetchData(projectId: string) {
 *   // real API call
 * }
 * ```
 *
 * @param mockOrFactory - Mock data or lazy import factory function
 * @param options - Configuration options
 */
export function withDemoMock<Fn extends (...args: any[]) => any>(
  mockOrFactory: any | ((ctx: DemoContext<Fn>) => MaybePromise<any>),
  options: DemoMockOptions<Fn> = {}
) {
  const {
    extract = ((args: any[]) => ({ projectId: args?.[0] })) as any,
    enabled = true,
    mapMock = (m) => m,
  } = options;

  return function decorator(original: Fn, _context?: any) {
    // If not a function, return as-is
    if (typeof original !== 'function') return original;

    return async function (this: any, ...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> {
      // Check if mocks are enabled
      const isEnabled = typeof enabled === 'function' ? enabled() : enabled;
      if (!isEnabled) {
        return original.apply(this, args);
      }

      // Extract IDs from arguments
      const ids = extract(args) ?? {};
      const isDemo =
        FORCE_DEMO_MODE ||
        ids.projectId === DEMO_PROJECT_ID ||
        ids.workspaceId === DEMO_WORKSPACE_ID;

      // If not demo, call original function
      if (!isDemo) {
        return original.apply(this, args);
      }

      console.log(`[Demo Mock] ✓ Using mock for ${original.name}`, { projectId: ids.projectId, workspaceId: ids.workspaceId });

      // Build context
      const ctx: DemoContext<Fn> = {
        args,
        projectId: ids.projectId,
        workspaceId: ids.workspaceId,
        original,
      };

      // Resolve mock data (supports lazy imports)
      let rawMock;
      if (typeof mockOrFactory === 'function') {
        const result = await (mockOrFactory as any)(ctx);
        // Support for ES modules with default export
        rawMock = result?.default ?? result;
      } else {
        rawMock = mockOrFactory;
      }

      // If rawMock is a function, call it to get the actual data (prevents mutation)
      if (typeof rawMock === 'function') {
        rawMock = rawMock();
      }

      // If no mock provided, fall back to real API
      if (rawMock == null) {
        console.warn(`[Demo Mock] ⚠ No mock data found for ${original.name}, falling back to real API`);
        return original.apply(this, args);
      }

      // Apply transformation and return
      const result = mapMock(rawMock, ctx) as Awaited<ReturnType<Fn>>;

      // Validate structure for fetchDailyEventsPortion BEFORE returning
      if (original.name === 'fetchDailyEventsPortion') {
        console.log('[Demo Mock] ⚠️  CRITICAL: Validating fetchDailyEventsPortion structure BEFORE store mutation');
        const dailyEvents = (result as any).dailyEvents;
        if (!dailyEvents) {
          console.error('[Demo Mock] ERROR: No dailyEvents found in result!', result);
        } else {
          console.log(`[Demo Mock] dailyEvents count: ${dailyEvents.length}`);
          dailyEvents.forEach((de: any, idx: number) => {
            console.log(`  [${idx}]:`, {
              id: de.id,
              groupingTimestamp: de.groupingTimestamp,
              count: de.count,
              affectedUsers: de.affectedUsers,
              hasEvent: !!de.event,
              eventId: de.event?.id,
              eventKeys: de.event ? Object.keys(de.event).slice(0, 3) : 'N/A',
            });
            if (!de.event) {
              console.error(`[Demo Mock] ERROR: dailyEvents[${idx}].event is missing!`);
            }
            if (!de.event?.id) {
              console.error(`[Demo Mock] ERROR: dailyEvents[${idx}].event.id is missing!`);
            }
          });
        }
      }

      // Log without deep cloning (avoid JSON.parse issues with functions/undefined)
      console.log(`[Demo Mock] → Returning mock data for ${original.name}:`, result);

      return result;
    } as Fn;
  };
}
