import { NotificationsChannels } from './notifications';

/**
 * This structure represents a settings of the user notifications
 */
export interface UserNotifications {
  /**
   * Settings for available user notification types
   */
  whatToReceive: UserNotificationsReceiveTypesConfig;

  /**
   * Available channels to receive
   */
  channels: UserNotificationsChannels;
}

/**
 * In DB we will store record with all types and their isEnabled states:
 * {
 *   IssueAssigning: true,
 *   WeeklyDigest: false,
 *   SystemMessages: true
 * }
 */
export type UserNotificationsReceiveTypesConfig = {
   [key in UserNotificationType]: boolean
};

/**
 * Available channels of the account notifications
 */
export type UserNotificationsChannels = Pick<NotificationsChannels, 'email' | 'webPush' | 'desktopPush'>;

/**
 * Available options of 'What to receive'
 */
export enum UserNotificationType {
  /**
   * When user is assigned to the issue (event)
   */
  IssueAssigning = 'IssueAssigning',

  /**
   * Regular digest of what happened on the project for the week
   */
  WeeklyDigest = 'WeeklyDigest',

  /**
   * Only important messages from Hawk team
   */
  SystemMessages = 'SystemMessages',
}
