import {
  MUTATION_CONFIRM_INVITE,
  MUTATION_CREATE_WORKSPACE,
  MUTATION_GRANT_ADMIN_PERMISSIONS,
  MUTATION_INVITE_TO_WORKSPACE,
  MUTATION_REMOVE_MEMBER_FROM_WORKSPACE,
  MUTATION_UPDATE_WORKSPACE,
  QUERY_ALL_WORKSPACES_WITH_PROJECTS,
  QUERY_WORKSPACES
} from './queries';
import * as api from '../index';

/**
 * Workspace representation
 */
interface Workspace {
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

interface CreateWorkspaceInput {
  /**
   * Workspace name to create
   */
  name: string;

  /**
   * Workspace image
   */
  image?: string;
}

/**
 * Create workspace and return it
 * @param {Workspace} workspaceInfo - workspace to create
 * @returns {Promise<Workspace>} created workspace
 */
export async function createWorkspace(workspaceInfo: CreateWorkspaceInput): Promise<Workspace> {
  return (await api.call(MUTATION_CREATE_WORKSPACE, workspaceInfo)).createWorkspace;
}

/**
 * Returns all user's workspaces and project.
 * @return {Promise<[Workspace]>}
 */
export async function getAllWorkspacesWithProjects(): Promise<Workspace[]> {
  return (await api.call(QUERY_ALL_WORKSPACES_WITH_PROJECTS, undefined, { initial: true })).workspaces;
}

/**
 * Invites user to workspace by email
 *
 * @param {string} workspaceId - id of workspace to which user is invited
 * @param {string} userEmail - invited user`s email
 * @returns {Promise<boolean>} true if user invited successfully
 */
export async function inviteToWorkspace(workspaceId: string, userEmail: string): Promise<boolean> {
  return (await api.call(MUTATION_INVITE_TO_WORKSPACE, { workspaceId, userEmail })).inviteToWorkspace;
}

/**
 * Confirms user invitation
 *
 * @param {string} workspaceId - id of workspace where invitation should be confirmed
 * @param {string} inviteHash - hash passed to the invite link
 * @returns {Promise<boolean>}
 */
export async function confirmInvite(workspaceId: string, inviteHash: string): Promise<boolean> {
  return (await api.call(MUTATION_CONFIRM_INVITE, { workspaceId, inviteHash })).confirmInvitation;
}

/**
 * Get workspaces
 * @param {array} ids – id of fetching workspaces
 * @return {Promise<[Workspace]>}
 */
export async function getWorkspaces(ids: string): Promise<Workspace> {
  return (await api.call(QUERY_WORKSPACES, { ids })).workspaces;
}

/**
 * Update workspace data
 * @returns {Promise<Boolean>}
 */
export async function updateWorkspace(id: string, name: string, description: string): Promise<boolean> {
  return (await api.call(MUTATION_UPDATE_WORKSPACE, { id, name, description })).updateWorkspace;
}

/**
 * Grant admin permission for passed user
 * @param {string} workspaceId - id of workspace where user is participate
 * @param {string} userId - id of user to grant permissions
 * @param {boolean} state - if true, grant permissions, if false, withdraw them
 * @returns {Promise<Boolean>}
 */
export async function grantAdminPermissions(workspaceId: string, userId: string, state = true): Promise<boolean> {
  return (await api.call(MUTATION_GRANT_ADMIN_PERMISSIONS, { workspaceId, userId, state })).grantAdmin;
}

/**
 * Remove user from workspace
 * @param {string} workspaceId - id of workspace where user is participate
 * @param {string} userId - id of user to remove
 * @param {string} userEmail - email of user to remove
 * @returns {Promise<boolean>}
 */
export async function removeUserFromWorkspace(
  workspaceId: string,
  userId: string,
  userEmail: string
): Promise<boolean> {
  return (await api.call(MUTATION_REMOVE_MEMBER_FROM_WORKSPACE, {
    workspaceId,
    userId,
    userEmail
  })).removeMemberFromWorkspace;
}