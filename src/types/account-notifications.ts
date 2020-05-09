import {NotificationsChannels} from './notifications';

/**
 * This structure represents a settings of the user notifications
 */
export interface AccountNotifications {
  /**
   * Receive type: 'ALL'  or 'ONLY_NEW'
   */
  whatToReceive: AccountNotificationTypes;

  /**
   * Available channels to receive
   */
  channels: NotificationsChannels;
}

/**
 * Available options of 'What to receive'
 */
export enum AccountNotificationTypes {
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
