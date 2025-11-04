import { init, track, setUserId } from '@amplitude/analytics-browser';
import type { EventOptions, Result } from '@amplitude/analytics-types';
import type { AnalyticsEventType } from './events';

/**
 * Flag if module was registered
 */
let isRegistered = false;

/**
 * Export available analytics methods
 */
export const Analytics = {
  /**
   * Initialize the analytics system
   * @param token - token for project in Amplitude
   */
  init: (token: string): Promise<void> => {
    isRegistered = true;

    return init(token).promise;
  },

  /**
   * Send an event to analytics server
   * @param eventType - event name
   * @param eventProperties - event properties
   * @param eventOptions - user info
   */
  track: (eventType: AnalyticsEventType, eventProperties?: Record<string, any>, eventOptions?: EventOptions): Promise<Result | string> | undefined => {
    if (!isRegistered) {
      return;
    }

    return track(eventType, eventProperties, eventOptions).promise;
  },

  /**
   * Set user id
   * @param userId - user identifier
   */
  setUserId: (userId: string): void => {
    if (!isRegistered) {
      return;
    }

    return setUserId(userId);
  },
};
