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
  slack?: NotificationsChannelSettings;

  /**
   * Alerts through the Loop
   */
  loop?: NotificationsChannelSettings;

  /**
   * Alerts through the Telegram
   */
  telegram?: NotificationsChannelSettings;

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
