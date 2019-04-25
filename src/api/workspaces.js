import { HTTP_OK } from './httpCodes';
import uuid from 'uuid/v4';

/**
 * Hawk API endpoint URL
 */
const API_ENDPOINT =
  process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/graphql';

/**
 * Mock api? true/false
 */
const MOCK = process.env.VUE_APP_API_MOCK;

/**
 * Enum for WorkspacesError type argument
 * @typedef WorkspacesErrorTypes
 */
export const WorkspacesErrorTypes = {
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Base error for workspaces module
 * @extends {Error}
 */
export class WorkspacesError extends Error {
  /**
   * Creates an instance of WorkspacesError.
   * @param {string} message - error message.
   * @param {WorkspacesErrorTypes} type - error type.
   * @param {*} [data] - additional data to pass. e.g. error from http library or response itself
   */
  constructor(message, type, data = null) {
    super(message);

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    this.type = type;

    if (data) {
      this.data = data;
    }

    // Clip constructor invokation from stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create workspace and return it
 * @param {Workspace} workspace - workspace to create
 * @returns {Promise<Workspace>} created workspace
 * @throws {WorkspacesError} Workspaces error occurred.
 */
export const createWorkspace = async workspace => {
  let resp;

  try {
    if (!MOCK) {
      // @todo make real request to API
    } else {
      resp = {
        status: HTTP_OK,
        data: {
          id: uuid(),
          name: workspace.name
        }
      };
    }
  } catch (e) {
    throw new WorkspacesError('Error while creating new workspace', WorkspacesErrorTypes.CREATE, e);
  }

  if (resp.status === HTTP_OK) {
    return resp.data;
  } else {
    throw new WorkspacesError('Unknown response', WorkspacesErrorTypes.UNKNOWN, resp);
  }
};

/**
 * Remove workspace by id return status (ok)
 * @param {string} workspaceId - workspaces id to delete
 * @returns {Promise<boolean>} Response status
 * @throws {WorkspacesError} Workspaces error occured.
 */
export const deleteWorkspace = async workspaceId => {
  let resp;

  try {
    if (!MOCK) {
      // @todo make real request to API
    } else {
      resp = {
        status: HTTP_OK
      };
    }
  } catch (e) {
    throw new WorkspacesError('Error while deleting', WorkspacesErrorTypes.DELETE, e);
  }

  if (resp.status === HTTP_OK) {
    return true;
  } else {
    throw new WorkspacesError('Unknown response', WorkspacesErrorTypes.UNKNOWN, resp.status);
  }
};
