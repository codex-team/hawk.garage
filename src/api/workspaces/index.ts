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
  MUTATION_CHANGE_WORKSPACE_PLAN_TO_DEFAULT,
  MUTATION_CANCEL_SUBSCRIPTION,
  MUTATION_JOIN_BY_INVITE_LINK,
  QUERY_SSO_WORKSPACE,
  QUERY_SSO_SETTINGS,
  MUTATION_UPDATE_SSO_SETTINGS
} from './queries';
import * as api from '../index';
import type {
  Workspace,
  WorkspacePreview,
  WorkspaceSsoConfig,
  WorkspaceSsoConfigInput
} from '@/types/workspaces';
import type { APIResponse, APIResponseData } from '@/types/api';
import { withMockDemo } from '@/utils/withMockDemo';

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
 * @param workspaceInfo - workspace to create
 * @returns created workspace
 */
export async function createWorkspace(workspaceInfo: CreateWorkspaceInput): Promise<APIResponse<{ workspace: Workspace }>> {
  const { image, ...rest } = workspaceInfo;

  return await api.call(MUTATION_CREATE_WORKSPACE, rest, { image });
}

/**
 * Leave workspace
 * @param workspaceId - id of workspace to leave
 */
export async function leaveWorkspace(workspaceId: string): Promise<boolean> {
  return (await api.callOld(MUTATION_LEAVE_WORKSPACE, { workspaceId })).leaveWorkspace;
}

/**
 * Returns all user's workspaces and project.
 * @returns
 */
export const getAllWorkspacesWithProjects = withMockDemo(
  'getAllWorkspacesWithProjects.mock',
  async function getAllWorkspacesWithProjects(): Promise<APIResponse<{ workspaces: Workspace[] }>> {
    return api.call(QUERY_ALL_WORKSPACES_WITH_PROJECTS, undefined, undefined, {
      initial: true,

      /**
       * This request calls on the app start, so we don't want to break app if something goes wrong
       * With this flag, errors from the API won't be thrown, but returned in the response for further handling
       */
      allowErrors: true,
    });
  },
  { debug: true }
);

/**
 * Invites user to workspace by email
 * @param workspaceId - id of workspace to which user is invited
 * @param userEmail - invited user`s email
 * @returns true if user invited successfully
 */
export async function inviteToWorkspace(workspaceId: string, userEmail: string): Promise<APIResponse<{ inviteToWorkspace: boolean }>> {
  return api.call(MUTATION_INVITE_TO_WORKSPACE, {
    workspaceId,
    userEmail,
  });
}

/**
 * Join to workspace by invite link
 * @param inviteHash - workspace invite link
 */
export async function joinByInviteLink(inviteHash: string): Promise<boolean> {
  return (await api.callOld(MUTATION_JOIN_BY_INVITE_LINK, {
    inviteHash,
  })).joinByInviteLink;
}

/**
 * Confirms user invitation
 * @param workspaceId - id of workspace where invitation should be confirmed
 * @param inviteHash - hash passed to the invite link
 * @returns
 */
export async function confirmInvite(workspaceId: string, inviteHash: string): Promise<boolean> {
  return (await api.callOld(MUTATION_CONFIRM_INVITE, {
    workspaceId,
    inviteHash,
  })).confirmInvitation;
}

/**
 * Get workspaces
 * @param ids – id of fetching workspaces
 * @returns
 */
export async function getWorkspaces(ids: string[]): Promise<Workspace[]> {
  return (await api.callOld(QUERY_WORKSPACES, { ids })).workspaces;
}

/**
 * Get workspace balance
 * @param ids – id of fetching workspaces balance
 */
export async function getBalance(ids: string[]): Promise<Workspace> {
  return (await api.callOld(QUERY_BALANCE, { ids })).workspaces;
}

/**
 * Update workspace data
 * @param id - id of the workspace to update
 * @param name - new name
 * @param description - new description
 * @param image - logo image file
 */
export async function updateWorkspace(id: string, name: string, description: string, image?: File): Promise<APIResponse<{ updateWorkspace: boolean }>> {
  return api.call(MUTATION_UPDATE_WORKSPACE, {
    id,
    name,
    description,
  }, { image });
}

/**
 * Grant admin permission for passed user
 * @param workspaceId - id of workspace where user is participate
 * @param userId - id of user to grant permissions
 * @param state - if true, grant permissions, if false, withdraw them
 * @returns
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
 * @param workspaceId - id of workspace where user is participate
 * @param userId - id of user to remove
 * @param userEmail - email of user to remove
 * @returns
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
 * @param workspaceId - id of workspace to change plan
 * @param planId - id of plan to set
 */
export async function changePlanForFreePLan(
  workspaceId: string,
  planId: string
): Promise<APIResponseData<Workspace>> {
  return (await api.callOld(MUTATION_CHANGE_WORKSPACE_PLAN_TO_DEFAULT, {
    input: {
      workspaceId,
      planId,
    },
  })).changeWorkspacePlanToDefault;
}

/**
 * Cancel subscription on tariff plan
 * @param workspaceId - workspace id to cancel subscription for
 */
export async function cancelSubscription(workspaceId: string): Promise<Pick<Workspace, 'id' | 'subscriptionId'>> {
  return (await api.callOld(MUTATION_CANCEL_SUBSCRIPTION, {
    input: {
      workspaceId,
    },
  })).workspace.cancelSubscription.record;
}

/**
 * Get workspace public info by ID for SSO login page
 * Available without authentication, returns only if SSO is enabled
 * @param id - identifier of workspace with sso enabled
 * @returns Workspace public info (id, name, image) or null if not found or SSO not enabled
 */
export async function getSsoWorkspace(id: string): Promise<APIResponse<{ ssoWorkspace: WorkspacePreview }>> {
  return api.call<{ ssoWorkspace: WorkspacePreview }>(QUERY_SSO_WORKSPACE, { id });
}

/**
 * Get SSO settings for workspace (admin only)
 * @param workspaceId - identifier of workspace
 * @returns SSO configuration or null if not configured
 */
export async function getSsoSettings(workspaceId: string): Promise<APIResponse<{ workspaces: Array<{ id: string;
  sso: WorkspaceSsoConfig | null; }>; }>> {
  return api.call<{
    workspaces: Array<{
      id: string;
      sso: WorkspaceSsoConfig | null;
    }>;
  }>(QUERY_SSO_SETTINGS, { workspaceId });
}

/**
 * Update SSO settings for workspace (admin only)
 * @param workspaceId - identifier of workspace
 * @param config - SSO configuration
 * @returns true if successful
 */
export async function updateSsoSettings(workspaceId: string, config: WorkspaceSsoConfigInput): Promise<APIResponse<{ updateWorkspaceSso: boolean }>> {
  return api.call<{ updateWorkspaceSso: boolean }>(MUTATION_UPDATE_SSO_SETTINGS, { workspaceId,
    config });
}
