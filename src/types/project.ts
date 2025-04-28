import { User } from './user';
import { ProjectNotificationsRule } from './project-notifications';
import { ProjectEventGroupingPattern } from './project-event-grouping-patterns';

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
}
