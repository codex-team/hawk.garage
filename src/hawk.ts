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

const errorsBlacklist = [
  'You need to refresh your tokens',
  'Navigation cancelled from',
  'Redirected when going from',
  'Avoided redundant navigation to current location',
  'User with this email already registered',
  'Wrong email or password'
];

/**
 * Composable for tracking errors via Hawk.so
 */
export function useErrorTracker(): {
  init: (options: ErrorTrackerInitialOptions) => void;
  track: (...args: Parameters<HawkCatcher['send']>) => void;
  } {
  /**
   * Initialize Hawk.so
   *
   * @param options - params to be passed to hawk initialization
   */
  function init({ vue, user }: ErrorTrackerInitialOptions): void {
    if (process.env.VUE_APP_HAWK_TOKEN) {
      const hawkOptions: HawkInitialSettings = {
        token: process.env.VUE_APP_HAWK_TOKEN,
        release: buildRevision,
        vue,
        beforeSend: (event) => {
          const isBlacklisted = errorsBlacklist.find(text => event.title.startsWith(text));

          return isBlacklisted ? false : event;
        },
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
   * @param {...any} args
   */
  function track(...args: Parameters<HawkCatcher['send']>): void {
    if (hawk) {
      hawk.send(...args);
    }
  }

  return {
    init,
    track,
  };
}
