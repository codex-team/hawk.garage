import type { UserNotifications } from './user-notifications.ts';

/**
 * Represents current authenticated user
 */
export interface User {
  /**
   * Id in a DB
   */
  id: string;

  /**
   * User email
   */
  email: string;

  /**
   * User name. Null by default
   */
  name?: string;

  /**
   * User profile photo
   */
  image?: string;

  /**
   * Notifications settings
   */
  notifications?: UserNotifications;
}
