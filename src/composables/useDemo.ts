/**
 * Demo mode composable
 *
 * Provides reactive demo mode state and management functions
 */

import { computed, getCurrentInstance, ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import { useRoute, type RouteLocationRaw, type Router } from 'vue-router';
import store from '@/store';
import { SET_TOKENS, FETCH_CURRENT_USER } from '@/store/modules/user/actionTypes';
import { FETCH_INITIAL_DATA } from '@/store/modules/app/actionTypes';
import { preserveUtmQuery } from '@/components/utils/utm/utm';
import type { ComputedRef } from 'vue';

type DemoControls = {
  /** Computed ref that returns `true` when demo mode is currently active */
  isDemoActive: ComputedRef<boolean>;
  /** Enables demo mode */
  enableDemo: () => Promise<void>;
  /** Disables demo mode */
  disableDemo: (options?: DisableDemoOptions) => Promise<void>;
  /** Toggles demo mode */
  toggleDemo: () => Promise<void>;
};

type DisableDemoOptions = {
  /**
   * Where to navigate after leaving demo mode.
   * Pass `false` to stay on the current route.
   */
  redirectTo?: RouteLocationRaw | false;
};

/**
 * Demo access token used for temporary auth in demo mode
 */
export const DEMO_ACCESS_TOKEN = 'demo-access-token';

/**
 * Demo refresh token used for temporary auth in demo mode
 */
export const DEMO_REFRESH_TOKEN = 'demo-refresh-token';

/**
 * True while disableDemo is doing window.location.assign —
 * App.vue must not soft-redirect to /login in that window
 */
let isHardRedirectPending = false;

/**
 * Whether demo exit is currently hard-navigating away
 */
export function isDemoHardRedirectPending(): boolean {
  return isHardRedirectPending;
}
const NAMED_ROUTE_PATHS: Record<string, string> = {
  'sign-up': '/sign-up',
  login: '/login',
  recover: '/recover',
};

/**
 * Builds absolute in-app href for hard navigation without async router import
 * @param redirectTo - vue-router location
 */
function buildLocationHref(redirectTo: RouteLocationRaw): string {
  if (typeof redirectTo === 'string') {
    return new URL(redirectTo, window.location.origin).href;
  }

  const path = redirectTo.path
    || (typeof redirectTo.name === 'string' ? NAMED_ROUTE_PATHS[redirectTo.name] : undefined)
    || '/';
  const query = preserveUtmQuery(
    (redirectTo.query || {}) as Parameters<typeof preserveUtmQuery>[0]
  );

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(key, String(item));
      });

      return;
    }

    if (value != null) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return `${window.location.origin}${path}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Composable for demo mode management
 */
export const useDemo = createSharedComposable((): DemoControls => {
  /** URL query parameter key that enables demo mode */
  const DEMO_QUERY_KEY = 'demo';
  /** Reactive flag that indicates whether demo mode is enabled */
  const isEnabled = ref(false);
  /** Prevents duplicate watcher initialization across repeated composable calls */
  let isWatcherInitialized = false;

  /**
   * Lazy router import avoids circular dependency with router.ts
   */
  const getRouter = async (): Promise<Router> => {
    const { default: router } = await import('@/router');

    return router;
  };

  /**
   * Real JWT session (not the demo placeholder token)
   */
  const hasRealSession = (): boolean => {
    const token = store.state.user.accessToken;

    return Boolean(token) && token !== DEMO_ACCESS_TOKEN;
  };

  /**
   * Applies demo mode state and synchronizes related Vuex modules
   * @param enabled - Next demo mode state
   */
  const setDemoState = (enabled: boolean): void => {
    isEnabled.value = enabled;

    if (enabled) {
      void store.dispatch('demo/enableDemo');

      if (!store.state.user.accessToken) {
        void store.dispatch(SET_TOKENS, {
          accessToken: DEMO_ACCESS_TOKEN,
          refreshToken: DEMO_REFRESH_TOKEN,
        });
      }

      return;
    }

    void store.dispatch('demo/disableDemo');

    if (store.state.user.accessToken === DEMO_ACCESS_TOKEN) {
      void store.dispatch(SET_TOKENS, {
        accessToken: '',
        refreshToken: '',
      });
      store.commit('SET_CURRENT_USER', null);
    }
  };

  /**
   * Reloads real account and workspace data after leaving demo mode
   */
  const reloadRealSessionData = async (): Promise<void> => {
    await store.dispatch(FETCH_INITIAL_DATA);
    await store.dispatch(FETCH_CURRENT_USER);
  };

  /**
   * Hard navigation avoids App.vue token watcher racing with vue-router redirects
   * @param redirectTo - Target route
   */
  const redirectWithHardNavigation = (redirectTo: RouteLocationRaw): void => {
    isHardRedirectPending = true;
    window.location.assign(buildLocationHref(redirectTo));
  };

  /**
   * Initializes route query watcher that enables demo mode from `?demo=1`
   */
  const initDemoWatcher = (): void => {
    if (isWatcherInitialized || !getCurrentInstance()) {
      return;
    }

    isWatcherInitialized = true;

    const route = useRoute();

    watch(
      () => route.query,
      async (query) => {
        const demoQueryValue = query[DEMO_QUERY_KEY];
        const demoValue = Array.isArray(demoQueryValue) ? demoQueryValue[0] : demoQueryValue;

        if (demoValue !== '1') {
          return;
        }

        setDemoState(true);

        const nextQuery = { ...query };

        delete nextQuery[DEMO_QUERY_KEY];

        const router = await getRouter();

        void router.replace({
          path: route.path,
          query: nextQuery,
          hash: route.hash,
        });
      },
      { immediate: true }
    );
  };

  initDemoWatcher();

  if (!isEnabled.value && store?.state?.demo?.isActive) {
    isEnabled.value = true;
  }

  if (isEnabled.value && !store.state.demo?.isActive) {
    setDemoState(true);
  }

  /**
   * Computed ref for demo mode state with fallback to store
   */
  const isDemoActive = computed<boolean>(() => {
    try {
      return isEnabled.value || (store?.state?.demo?.isActive ?? false);
    } catch (error) {
      throw new Error(`[useDemo] Could not access store, demo mode disabled: ${String(error)}`);
    }
  });

  /**
   * Enable demo mode
   */
  const enableDemo = (): Promise<void> => {
    try {
      setDemoState(true);
    } catch (error) {
      throw new Error(`[useDemo] Failed to enable demo mode: ${String(error)}`);
    }

    return Promise.resolve();
  };

  /**
   * Disable demo mode and navigate away from demo session when needed
   * @param options - Exit options
   */
  const disableDemo = async (options: DisableDemoOptions = {}): Promise<void> => {
    try {
      let redirectTo = options.redirectTo;
      const realSession = hasRealSession();

      if (redirectTo === undefined) {
        /**
         * Finish demo: stay in account if there is a real session,
         * otherwise go to login (demo-access-token is not a real session)
         */
        redirectTo = realSession ? false : { name: 'login' };
      } else if (redirectTo !== false && realSession) {
        /**
         * e.g. Register while already logged in — skip sign-up, enter account
         */
        redirectTo = false;
      }

      const shouldStayOnPage = redirectTo === false && realSession;

      setDemoState(false);

      if (shouldStayOnPage) {
        await reloadRealSessionData();

        return;
      }

      if (redirectTo !== false) {
        redirectWithHardNavigation(redirectTo);
      }
    } catch (error) {
      throw new Error(`[useDemo] Failed to disable demo mode: ${String(error)}`);
    }
  };

  /**
   * Toggle demo mode
   */
  const toggleDemo = (): Promise<void> => {
    try {
      if (isEnabled.value) {
        return disableDemo();
      }

      setDemoState(true);
    } catch (error) {
      throw new Error(`[useDemo] Failed to toggle demo mode: ${String(error)}`);
    }

    return Promise.resolve();
  };

  return {
    isDemoActive,
    enableDemo,
    disableDemo,
    toggleDemo,
  };
});
