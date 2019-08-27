import { HTTP_OK } from '../httpCodes';
import {
  MUTATION_CREATE_WORKSPACE,
  QUERY_ALL_WORKSPACES_WITH_PROJECTS_AND_USERS,
  MUTATION_INVITE_TO_WORKSPACE,
  MUTATION_CONFIRM_INVITE
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
export async function getAllWorkspacesWithProjectsAndUsers() {
  return (await api.call(QUERY_ALL_WORKSPACES_WITH_PROJECTS_AND_USERS, null, { initial: true })).workspaces;
}

/**
 * Invites user to workspace by email
 *
 * @param {string} workspaceId - id of workspace to which user is invited
 * @param {string} userEmail - invited user`s email
 * @returns {Promise<boolean>} true if user invited successfully
 */
export async function inviteToWorkspace(workspaceId, userEmail) {
  return api.call(MUTATION_INVITE_TO_WORKSPACE, { workspaceId, userEmail });
}

/**
 * Confirms user invitation
 *
 * @param {string} workspaceId - id of workspace where invitation should be confirmed
 * @param {string} inviteHash - hash passed to the invite link
 * @returns {Promise<void>}
 */
export async function confirmInvite(workspaceId, inviteHash) {
  return api.call(MUTATION_CONFIRM_INVITE, { workspaceId, inviteHash });
}
