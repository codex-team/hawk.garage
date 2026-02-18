/**
 * Demo mode composable
 *
 * Provides reactive demo mode state and management functions
 */

import { getCurrentInstance, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '@/store';
import { SET_TOKENS } from '@/store/modules/user/actionTypes';

type DemoControls = {
  isEnabled: typeof isEnabled;
  isDemoActive: () => boolean;
  enableDemo: () => Promise<void>;
  disableDemo: () => Promise<void>;
  toggleDemo: () => Promise<void>;
};

const DEMO_ACCESS_TOKEN = 'demo-access-token';
const DEMO_REFRESH_TOKEN = 'demo-refresh-token';
const DEMO_QUERY_KEY = 'demo';

export const isEnabled = ref(false);
let isWatcherInitialized = false;

function setDemoState(enabled: boolean): void {
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
}

if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);

  if (params.get(DEMO_QUERY_KEY) === '1') {
    isEnabled.value = true;
  }
}

function initDemoWatcher(): void {
  if (isWatcherInitialized) {
    return;
  }

  if (!getCurrentInstance()) {
    return;
  }

  isWatcherInitialized = true;

  const route = useRoute();
  const router = useRouter();

  watch(
    () => route.query[DEMO_QUERY_KEY],
    (value) => {
      const demoValue = Array.isArray(value) ? value[0] : value;

      if (demoValue !== '1') {
        return;
      }

      setDemoState(true);

      const nextQuery = { ...route.query };

      delete nextQuery[DEMO_QUERY_KEY];

      void router.replace({ path: route.path,
        query: nextQuery,
        hash: route.hash });
    },
    { immediate: true }
  );
}

/**
 * Composable for demo mode management
 */
export function useDemo(): DemoControls {
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
  const enableDemo = async (): Promise<void> => {
    try {
      setDemoState(true);
    } catch (error) {
      console.error('[useDemo] Failed to enable demo mode:', error);
    }
  };

  /**
   * Disable demo mode
   */
  const disableDemo = async (): Promise<void> => {
    try {
      setDemoState(false);
    } catch (error) {
      console.error('[useDemo] Failed to disable demo mode:', error);
    }
  };

  /**
   * Toggle demo mode
   */
  const toggleDemo = async (): Promise<void> => {
    try {
      setDemoState(!isEnabled.value);
    } catch (error) {
      console.error('[useDemo] Failed to toggle demo mode:', error);
    }
  };

  return {
    isEnabled,
    isDemoActive,
    enableDemo,
    disableDemo,
    toggleDemo,
  };
}
