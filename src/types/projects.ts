/**
 * Project representation
 */
export interface Project {
  /**
   * Project id
   */
  id: string;

  /**
   * Project name
   */
  name: string;

  /**
   * Project description
   */
  description?: string;

  /**
   * Project image
   */
  image?: string | File;
}
