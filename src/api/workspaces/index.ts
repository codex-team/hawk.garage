import {
  MUTATION_CONFIRM_INVITE,
  MUTATION_CREATE_WORKSPACE,
  MUTATION_LEAVE_WORKSPACE,
  MUTATION_GRANT_ADMIN_PERMISSIONS,
  MUTATION_INVITE_TO_WORKSPACE,
  MUTATION_REMOVE_MEMBER_FROM_WORKSPACE,
  MUTATION_UPDATE_WORKSPACE,
  QUERY_ALL_WORKSPACES_WITH_PROJECTS,
  QUERY_WORKSPACES,
  QUERY_BALANCE,
  MUTATION_CHANGE_WORKSPACE_PLAN_FOR_FREE_PLAN,
  MUTATION_CANCEL_SUBSCRIPTION, MUTATION_JOIN_BY_INVITE_LINK
} from './queries';
import * as api from '../index';
import { Workspace } from '@/types/workspaces';
import { APIResponse, APIResponseData } from '@/types/api';

interface CreateWorkspaceInput {
  /**
   * Workspace name to create
   */
  name: string;

  /**
   * Workspace image
   */
  image?: File;
}

/**
 * Create workspace and return it
 *
 * @param {Workspace} workspaceInfo - workspace to create
 * @returns {Promise<Workspace>} created workspace
 */
export async function createWorkspace(workspaceInfo: CreateWorkspaceInput): Promise<APIResponse<{workspace: Workspace}>> {
  const { image, ...rest } = workspaceInfo;

  return await api.call(MUTATION_CREATE_WORKSPACE, rest, { image });
}

/**
 * Leave workspace
 *
 * @param {string} workspaceId - id of workspace to leave
 */
export async function leaveWorkspace(workspaceId: string): Promise<boolean> {
  return (await api.callOld(MUTATION_LEAVE_WORKSPACE, { workspaceId })).leaveWorkspace;
}

/**
 * Returns all user's workspaces and project.
 *
 * @returns {Promise<Workspace[]>}
 */
export async function getAllWorkspacesWithProjects(): Promise<APIResponse<{ workspaces: Workspace[] }>> {
  return api.call(QUERY_ALL_WORKSPACES_WITH_PROJECTS, undefined, undefined, {
    initial: true,
  });
}

/**
 * Invites user to workspace by email
 *
 * @param {string} workspaceId - id of workspace to which user is invited
 * @param {string} userEmail - invited user`s email
 * @returns {Promise<boolean>} true if user invited successfully
 */
export async function inviteToWorkspace(workspaceId: string, userEmail: string): Promise<boolean> {
  return (await api.callOld(MUTATION_INVITE_TO_WORKSPACE, {
    workspaceId,
    userEmail,
  })).inviteToWorkspace;
}

/**
 * Join to workspace by invite link
 *
 * @param inviteHash - workspace invite link
 */
export async function joinByInviteLink(inviteHash: string): Promise<boolean> {
  return (await api.callOld(MUTATION_JOIN_BY_INVITE_LINK, {
    inviteHash,
  })).joinByInviteLink;
}

/**
 * Confirms user invitation
 *
 * @param {string} workspaceId - id of workspace where invitation should be confirmed
 * @param {string} inviteHash - hash passed to the invite link
 * @returns {Promise<boolean>}
 */
export async function confirmInvite(workspaceId: string, inviteHash: string): Promise<boolean> {
  return (await api.callOld(MUTATION_CONFIRM_INVITE, {
    workspaceId,
    inviteHash,
  })).confirmInvitation;
}

/**
 * Get workspaces
 *
 * @param {Array} ids – id of fetching workspaces
 * @returns {Promise<Workspace[]>}
 */
export async function getWorkspaces(ids: string): Promise<Workspace[]> {
  return (await api.callOld(QUERY_WORKSPACES, { ids })).workspaces;
}

/**
 * Get workspace balance
 *
 * @param ids – id of fetching workspaces balance
 */
export async function getBalance(ids: string[]): Promise<Workspace> {
  return (await api.callOld(QUERY_BALANCE, { ids })).workspaces;
}

/**
 * Update workspace data
 *
 * @param id - id of the workspace to update
 * @param name - new name
 * @param description - new description
 * @param image - logo image file
 */
export async function updateWorkspace(id: string, name: string, description: string, image?: File): Promise<boolean> {
  return (await api.callOld(MUTATION_UPDATE_WORKSPACE, {
    id,
    name,
    description,
  }, { image })).updateWorkspace;
}

/**
 * Grant admin permission for passed user
 *
 * @param {string} workspaceId - id of workspace where user is participate
 * @param {string} userId - id of user to grant permissions
 * @param {boolean} state - if true, grant permissions, if false, withdraw them
 * @returns {Promise<boolean>}
 */
export async function grantAdminPermissions(workspaceId: string, userId: string, state = true): Promise<boolean> {
  return (await api.callOld(MUTATION_GRANT_ADMIN_PERMISSIONS, {
    workspaceId,
    userId,
    state,
  })).grantAdmin;
}

/**
 * Remove user from workspace
 *
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
  return (await api.callOld(MUTATION_REMOVE_MEMBER_FROM_WORKSPACE, {
    workspaceId,
    userId,
    userEmail,
  })).removeMemberFromWorkspace;
}

/**
 * Changes workspace tariff plan
 *
 * @param {string} workspaceId - id of workspace to change plan
 * @param {string} planId - id of plan to set
 */
export async function changePlanForFreePLan(
  workspaceId: string,
  planId: string
): Promise<APIResponseData<Workspace>> {
  return (await api.callOld(MUTATION_CHANGE_WORKSPACE_PLAN_FOR_FREE_PLAN, {
    input: {
      workspaceId,
      planId,
    },
  })).changeWorkspacePlanToDefault;
}

/**
 * Cancel subscription on tariff plan
 *
 * @param workspaceId - workspace id to cancel subscription for
 */
export async function cancelSubscription(workspaceId: string): Promise<Pick<Workspace, 'id' | 'subscriptionId'>> {
  return (await api.callOld(MUTATION_CANCEL_SUBSCRIPTION, {
    input: {
      workspaceId,
    },
  })).workspace.cancelSubscription.record;
}
