import type { User } from './user';
import type { ProjectNotificationsRule } from './project-notifications';
import type { ProjectEventGroupingPattern } from './project-event-grouping-patterns';

/**
 * Rate limits configuration for a project
 */
export interface ProjectRateLimitSettings {
  /**
   * Rate limit threshold (N events)
   */
  N: number;

  /**
   * Rate limit period in seconds (T seconds)
   */
  T: number;
}

/**
 * Structure represents a Project got from API
 */
export interface Project {
  /**
   * Project ID
   */
  id: string;

  /**
   * Project Integration Token
   */
  token: string;

  /**
   * Project name
   */
  name: string;

  /**
   * User who created project
   */
  uidAdded: User;

  /**
   * Count of unread events
   */
  unreadCount: number;

  /**
   * Project description
   */
  description?: string;

  /**
   * URL of a project logo
   */
  image?: string;

  /**
   * List of notifications rules
   */
  notifications?: ProjectNotificationsRule[];

  /**
   * List of events grouping patterns
   */
  eventGroupingPatterns?: ProjectEventGroupingPattern[];

  /**
   * Rate limits configuration
   */
  rateLimitSettings?: ProjectRateLimitSettings;
}
