/**
 * Demo mode composable
 *
 * Provides reactive demo mode state and management functions
 */

import { getCurrentInstance, ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import store from '@/store';
import { SET_TOKENS } from '@/store/modules/user/actionTypes';
import type { Ref } from 'vue';

type DemoControls = {
  /** Reactive flag for current demo mode state */
  isEnabled: Ref<boolean>;
  /** Returns `true` when demo mode is currently active */
  isDemoActive: () => boolean;
  /** Enables demo mode */
  enableDemo: () => Promise<void>;
  /** Disables demo mode */
  disableDemo: () => Promise<void>;
  /** Toggles demo mode */
  toggleDemo: () => Promise<void>;
};

/**
 * Composable for demo mode management
 */
export const useDemo = createSharedComposable((): DemoControls => {
  /** Demo access token used for temporary auth in demo mode */
  const DEMO_ACCESS_TOKEN = 'demo-access-token';
  /** Demo refresh token used for temporary auth in demo mode */
  const DEMO_REFRESH_TOKEN = 'demo-refresh-token';
  /** URL query parameter key that enables demo mode */
  const DEMO_QUERY_KEY = 'demo';
  /** Reactive flag that indicates whether demo mode is enabled */
  const isEnabled = ref(false);
  /** Prevents duplicate watcher initialization across repeated composable calls */
  let isWatcherInitialized = false;

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
    }
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
    const router = useRouter();

    watch(
      () => route.query,
      (query) => {
        const demoQueryValue = query[DEMO_QUERY_KEY];
        const demoValue = Array.isArray(demoQueryValue) ? demoQueryValue[0] : demoQueryValue;

        if (demoValue !== '1') {
          return;
        }

        setDemoState(true);

        const nextQuery = { ...query };

        delete nextQuery[DEMO_QUERY_KEY];

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
   * Check if demo mode is active
   * @returns true if demo mode is active
   */
  const isDemoActive = (): boolean => {
    try {
      return isEnabled.value || (store?.state?.demo?.isActive ?? false);
    } catch (error) {
      console.warn('[useDemo] Could not access store, demo mode disabled:', error);

      return false;
    }
  };

  /**
   * Enable demo mode
   */
  const enableDemo = (): Promise<void> => {
    try {
      setDemoState(true);
    } catch (error) {
      console.error('[useDemo] Failed to enable demo mode:', error);
    }

    return Promise.resolve();
  };

  /**
   * Disable demo mode
   */
  const disableDemo = (): Promise<void> => {
    try {
      setDemoState(false);
    } catch (error) {
      console.error('[useDemo] Failed to disable demo mode:', error);
    }

    return Promise.resolve();
  };

  /**
   * Toggle demo mode
   */
  const toggleDemo = (): Promise<void> => {
    try {
      setDemoState(!isEnabled.value);
    } catch (error) {
      console.error('[useDemo] Failed to toggle demo mode:', error);
    }

    return Promise.resolve();
  };

  return {
    isEnabled,
    isDemoActive,
    enableDemo,
    disableDemo,
    toggleDemo,
  };
});
