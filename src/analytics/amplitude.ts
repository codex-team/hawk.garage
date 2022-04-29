import { init, track, setUserId } from '@amplitude/analytics-browser';
import { EventOptions, Result } from '@amplitude/analytics-types';
import { AnalyticsEventTypes } from './events';

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
   *
   * @param token - token for project in Amplitude
   */
  init: (token: string): Promise<void> => {
    isRegistered = true;

    return init(token).promise;
  },

  /**
   * Send an event to analytics server
   *
   * @param eventType - event name
   * @param eventProperties - event properties
   * @param eventOptions - user info
   */
  track: (eventType: AnalyticsEventTypes, eventProperties?: Record<string, any> | undefined, eventOptions?: EventOptions | undefined): Promise<Result|string> => {
    if (!isRegistered) {
      return Promise.reject('Analytics module is not connected');
    }

    return track(eventType, eventProperties, eventOptions).promise;
  },

  /**
   * Set user id
   *
   * @param userId - user identifier
   */
  setUserId: (userId: string): void => {
    return setUserId(userId);
  },
};
