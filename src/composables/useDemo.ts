/**
 * Demo mode composable
 *
 * Provides reactive demo mode state and management functions
 */

import store from '@/store';

/**
 * Check if demo mode is active
 * @returns true if demo mode is active
 */
export function isDemoActive(): boolean {
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
    console.warn('[useDemo] Could not access store, demo mode disabled:', error);

    return false;
  }
}

/**
 * Enable demo mode
 */
export async function enableDemo(): Promise<void> {
  try {
    await store.dispatch('demo/enableDemo');
  } catch (error) {
    console.error('[useDemo] Failed to enable demo mode:', error);
  }
}

/**
 * Disable demo mode
 */
export async function disableDemo(): Promise<void> {
  try {
    await store.dispatch('demo/disableDemo');
  } catch (error) {
    console.error('[useDemo] Failed to disable demo mode:', error);
  }
}

/**
 * Toggle demo mode
 */
export async function toggleDemo(): Promise<void> {
  try {
    await store.dispatch('demo/toggleDemo');
  } catch (error) {
    console.error('[useDemo] Failed to toggle demo mode:', error);
  }
}

type DemoControls = {
  isDemoActive: typeof isDemoActive;
  enableDemo: typeof enableDemo;
  disableDemo: typeof disableDemo;
  toggleDemo: typeof toggleDemo;
};

/**
 * Composable for demo mode management
 */
export function useDemo(): DemoControls {
  return {
    isDemoActive,
    enableDemo,
    disableDemo,
    toggleDemo,
  };
}
