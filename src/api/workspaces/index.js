import { HTTP_OK } from '../httpCodes';
import uuid from 'uuid/v4';
import { QUERY_ALL_WORKSPACES_WITH_PROJECTS } from './queries';
import * as api from '../index';

/**
 * Mock api? true/false
 */
const MOCK = process.env.VUE_APP_API_MOCK;

/**
 * Enum of workspaces module errors
 * @enum {String}
 */
export const WORKSPACES_ERROR = {
  CREATE: 'An error occurred during the creating attempt',
  DELETE: 'An error occurred during the deletion attempt',
  UNKNOWN: 'Unknown error occurred'
};

/**
 * Create workspace and return it
 * @param {Workspace} workspace - workspace to create
 * @returns {Promise<Workspace>} created workspace
 * @throws {Error} Workspaces error occurred.
 */
export async function createWorkspace(workspace) {
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
    throw new Error(WORKSPACES_ERROR.CREATE);
  }

  if (resp.status === HTTP_OK) {
    return resp.data;
  } else {
    throw new Error(WORKSPACES_ERROR.UNKNOWN);
  }
}

/**
 * Remove workspace by id return status (ok)
 * @param {string} workspaceId - workspaces id to delete
 * @returns {Promise<boolean>} Response status
 * @throws {Error} Workspaces error occured.
 */
export async function deleteWorkspace(workspaceId) {
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
    throw new Error(WORKSPACES_ERROR.DELETE);
  }

  if (resp.status === HTTP_OK) {
    return true;
  } else {
    throw new Error(WORKSPACES_ERROR.UNKNOWN);
  }
}

/**
 * Returns all user's workspaces and project.
 * @return {Promise<[Workspace]>}
 */
export async function getAllWorkspacesWithProjects() {
  return (await api.call(QUERY_ALL_WORKSPACES_WITH_PROJECTS)).workspaces;
}
