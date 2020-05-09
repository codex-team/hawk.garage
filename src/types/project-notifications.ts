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
  ALL = 'ALL',

  /**
   * Only first occurrence
   */
  ONLY_NEW = 'ONLY_NEW',
}
