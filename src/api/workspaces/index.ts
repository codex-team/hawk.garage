import {
  MUTATION_CREATE_WORKSPACE,
  QUERY_ALL_WORKSPACES_WITH_PROJECTS,
  MUTATION_INVITE_TO_WORKSPACE,
  MUTATION_CONFIRM_INVITE,
  MUTATION_UPDATE_WORKSPACE,
  QUERY_WORKSPACES,
  MUTATION_GRANT_ADMIN_PERMISSIONS,
  MUTATION_REMOVE_MEMBER_FROM_WORKSPACE,
} from "./queries.ts";
import * as api from "../index";

interface Workspace {
  id: string
}

interface CreateWorkspaceMutationVariables {
  name: string,
  image?: string
}

interface CreateWorkspaceResponse {
  createWorkspace: Workspace
}

/**
 * Create workspace and return it
 * @param {Workspace} workspaceInfo - workspace to create
 * @returns {Promise<Workspace>} created workspace
 */
export async function createWorkspace(workspaceInfo: CreateWorkspaceMutationVariables): Promise<Workspace> {
  return (await api.call<CreateWorkspaceMutationVariables, CreateWorkspaceResponse>(MUTATION_CREATE_WORKSPACE, workspaceInfo)).createWorkspace;
}

interface GetAllWorkspacesQueryResponse {
  workspaces: Workspace[]
}

/**
 * Returns all user's workspaces and project.
 * @return {Promise<[Workspace]>}
 */
export async function getAllWorkspacesWithProjects(): Promise<Workspace[]> {
  return (await api.call<undefined, GetAllWorkspacesQueryResponse>(QUERY_ALL_WORKSPACES_WITH_PROJECTS, undefined, { initial: true })).workspaces;
}

interface InviteToWorkspaceMutationVariables {
  workspaceId: string,
  userEmail: string
}

interface InviteToWorkspaceMutationResponse {
  inviteToWorkspace: boolean
}

/**
 * Invites user to workspace by email
 *
 * @param {string} workspaceId - id of workspace to which user is invited
 * @param {string} userEmail - invited user`s email
 * @returns {Promise<boolean>} true if user invited successfully
 */
export async function inviteToWorkspace(workspaceId: string, userEmail: string): Promise<boolean> {
  return (await api.call<InviteToWorkspaceMutationVariables, InviteToWorkspaceMutationResponse>(MUTATION_INVITE_TO_WORKSPACE, { workspaceId, userEmail })).inviteToWorkspace;
}

/**
 * Confirms user invitation
 *
 * @param {string} workspaceId - id of workspace where invitation should be confirmed
 * @param {string} inviteHash - hash passed to the invite link
 * @returns {Promise<void>}
 */
export async function confirmInvite(workspaceId, inviteHash) {
  return (await api.call(MUTATION_CONFIRM_INVITE, { workspaceId, inviteHash })).confirmInvitation;
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

/**
 * Grant admin permission for passed user
 *
 * @param {string} workspaceId - id of workspace where user is participate
 * @param {string} userId - id of user to grant permissions
 * @param {boolean} state - if true, grant permissions, if false, withdraw them
 * @returns {Promise<Boolean>}
 */
export async function grantAdminPermissions(workspaceId, userId, state = true) {
  return (await api.call(MUTATION_GRANT_ADMIN_PERMISSIONS, { workspaceId, userId, state })).grantAdmin;
}

/**
 * Remove user from workspace
 *
 * @param {string} workspaceId - id of workspace where user is participate
 * @param {string} userId - id of user to remove
 * @param {string} userEmail - email of user to remove
 * @returns {Promise<*>}
 */
export async function removeUserFromWorkspace(workspaceId, userId, userEmail) {
  return (await api.call(MUTATION_REMOVE_MEMBER_FROM_WORKSPACE, { workspaceId, userId, userEmail })).removeMemberFromWorkspace;
}
