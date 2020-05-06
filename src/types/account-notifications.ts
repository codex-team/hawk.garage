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

/**
 * Available channels ("where to receive")
 */
export interface NotificationsChannels {
  /**
   * Alerts on email
   */
  email?: NotificationsChannelSettings;

  /**
   * Alerts through the Slack
   */
  webPush?: NotificationsChannelSettings;

  /**
   * Alerts through the Telegram
   */
  desktopPush?: NotificationsChannelSettings;
}

/**
 * Setting of a channel
 */
export interface NotificationsChannelSettings {
  /**
   * Allows to disable channel without removing endpoint
   */
  isEnabled: boolean;

  /**
   * Endpoint: email, slack webhook, telegram bot webhook
   */
  endpoint: string;

  /**
   * Minimal pause between second notification, in seconds
   */
  minPeriod?: number;
}
