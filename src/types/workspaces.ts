/**
 * Workspace representation
 */
export interface Workspace {
  /**
   * Workspace id
   */
  id: string;

  /**
   * Workspace name
   */
  name: string;

  /**
   * Workspace description
   */
  description?: string;

  /**
   * Workspace image
   */
  image?: string;
}
