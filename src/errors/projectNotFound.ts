import NotFoundError from './404';

/**
 * Error thrown when a project is not found
 */
export default class ProjectNotFoundError extends NotFoundError {
  /**
   * @param message - string will be shown in error traceback
   */
  constructor(message = 'Project not found') {
    super(message);

    this.name = 'ProjectNotFoundError';
  }
}
