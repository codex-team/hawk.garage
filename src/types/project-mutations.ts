import { ProjectRateLimitSettings } from './project';

/**
 * Base payload for updating a project
 * All fields except id are optional - only specified fields will be updated
 */
export interface UpdateProjectPayload {
  /**
   * Id of a project to update
   */
  id: string;

  /**
   * New name (required by GraphQL, but can be current value)
   */
  name: string;

  /**
   * New description
   */
  description?: string;

  /**
   * Image file selected
   */
  image?: File;

  /**
   * Rate limits configuration
   */
  rateLimitSettings?: ProjectRateLimitSettings;
}
