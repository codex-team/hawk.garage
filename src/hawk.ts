import HawkCatcher, { HawkInitialSettings, HawkJavaScriptEvent } from '@hawk.so/javascript';
import type Vue from 'vue';

/**
 * Current build revision
 * passed from Webpack Define Plugin
 */
declare const buildRevision: string;

/**
 * Initial options of error tracking composable
 */
export interface ErrorTrackerInitialOptions {
  /**
   * Instance of the Vue app
   */
  vue: typeof Vue;

  /**
   * Current user to be attached to events
   */
  user?: HawkJavaScriptEvent['user'];
}

/**
 * Shared instance of Hawk.so
 * null if Hawk is not initialized
 */
let hawk: HawkCatcher | null = null;

/**
 * Composable for tracking errors via Hawk.so
 */
export function useErrorTracker() {
  /**
   * Initialize Hawk.so
   *
   * @param options - params to be passed to hawk initialization
   */
  function initHawk({ vue, user }: ErrorTrackerInitialOptions): void {
    if (process.env.VUE_APP_HAWK_TOKEN) {
      const hawkOptions: HawkInitialSettings = {
        token: process.env.VUE_APP_HAWK_TOKEN,
        release: buildRevision,
        vue,
      };

      if (user) {
        hawkOptions.user = user;
      }

      hawk = new HawkCatcher(hawkOptions);
    }
  }

  /**
   * Method for manual error sending
   *
   * @param error - error to track
   * @param context - additional context
   */
  function track(error: Parameters<HawkCatcher['send']>[0], context?: Parameters<HawkCatcher['send']>[1]): void {
    if (hawk) {
      hawk.send(error, context);
    }
  }

  return {
    initHawk,
    track
  }
}