import { HTTP_OK } from '../httpCodes';
import {
  MUTATION_CREATE_WORKSPACE,
  MUTATION_UPDATE_WORKSPACE,
  QUERY_ALL_WORKSPACES_WITH_PROJECTS,
  QUERY_WORKSPACES
} from './queries';
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
 * @param {Workspace} workspaceInfo - workspace to create
 * @returns {Promise<Workspace>} created workspace
 */
export async function createWorkspace(workspaceInfo) {
  return (await api.call(MUTATION_CREATE_WORKSPACE, workspaceInfo)).createWorkspace;
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
  return (await api.call(QUERY_ALL_WORKSPACES_WITH_PROJECTS, null, { initial: true })).workspaces;
}

/**
 * Get workspaces
 * @param {array} ids – id of fetching workspaces
 * @return {Promise<[Workspace]>}
 */
export async function getWorkspaces(ids) {
  return (await api.call(QUERY_WORKSPACES, { ids })).workspaces;
}

/**
 * Update workspace data
 * @returns {Promise<Boolean>}
 */
export async function updateWorkspace(id, name, description) {
  return (await api.call(MUTATION_UPDATE_WORKSPACE, { id, name, description })).updateWorkspace;
}
