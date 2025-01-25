import { NotificationsChannels } from './notifications';

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
  ONLY_NEW = 'ONLY_NEW',
}

export enum NotificationTresholdPeriodEnum {
  /**
   * One minute in milliseconds
   */
  'minute' = 60000,

  /**
   * One hour in milliseconds
   */
  'hour' = 3600000,

  /**
   * One day in milliseconds
   */
  'day' = 86400000,

  /**
   * One week in milliseconds
   */
  'week' = 604800000,
}
