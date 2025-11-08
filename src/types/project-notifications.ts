import type { NotificationsChannels } from './notifications';

/**
 * This structure represents a single rule of notifications settings
 */
export interface ProjectNotificationsRule {
  /**
   * Id of Rule
   */
  id: string;

  /**
   * Allows to disable rule without removing
   */
  isEnabled: true;

  /**
   * Creator of the rule
   */
  uidAdded: string;

  /**
   * Receive type: 'ALL'  or 'ONLY_NEW'
   */
  whatToReceive: ReceiveTypes;

  /**
   * Only those which contains passed words
   */
  including?: string[];

  /**
   * Skip those which contains passed words
   */
  excluding?: string[];

  /**
   * Available channels to receive
   */
  channels: ProjectNotificationsChannels;

  /**
   * Threshold to receive notification
   */
  threshold?: number;

  /**
   * Period to receive notification
   */
  thresholdPeriod?: number;
}

/**
 * Available channels of the project notifications
 */
export type ProjectNotificationsChannels = Pick<NotificationsChannels, 'email' | 'telegram' | 'slack'>;

/**
 * Available options of 'What to receive'
 */
export enum ReceiveTypes {
  /**
   * All notifications
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SEEN_MORE = 'SEEN_MORE',

  /**
   * Only first occurrence
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ONLY_NEW = 'ONLY_NEW'
}

/**
 * Available periods to receive notification
 * This map is used for comparisons between displayed threshold period values and stored ones
 */
/* eslint-disable @typescript-eslint/no-magic-numbers */
export const thresholdPeriodToMilliseconds = new Map<string, number>([
  /**
   * One minute in milliseconds
   */
  ['minute', 60000],
  /**
   * One hour in milliseconds
   */
  ['hour', 3600000],
  /**
   * One day in milliseconds
   */
  ['day', 86400000],
  /**
   * One week in milliseconds
   */
  ['week', 604800000],
]);
/* eslint-enable @typescript-eslint/no-magic-numbers */

/**
 * Available periods to receive notification
 * This map is used for comparisons between stored threshold period values and displayed ones
 */
export const millisecondsToThresholdPeriod = new Map<number, string>(
  Array.from(thresholdPeriodToMilliseconds.entries()).map(([key, value]) => [value, key])
);
