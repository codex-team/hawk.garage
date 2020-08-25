import {
  CREATE_WORKSPACE,
  SET_WORKSPACES_LIST,
  LEAVE_WORKSPACE,
  SET_CURRENT_WORKSPACE,
  INVITE_TO_WORKSPACE,
  CONFIRM_INVITE,
  UPDATE_WORKSPACE,
  FETCH_WORKSPACE,
  GRANT_ADMIN_PERMISSIONS,
  REMOVE_USER_FROM_WORKSPACE,
  GET_BUSINESS_OPERATIONS,
  CHANGE_WORKSPACE_PLAN
} from './actionTypes';
import { REMOVE_PROJECTS_BY_WORKSPACE_ID } from '../projects/actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as workspaceApi from '../../../api/workspaces/index.ts';
import * as billingApi from '../../../api/billing';
import Vue from 'vue';
import { isPendingMember } from '@/store/modules/workspaces/helpers';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  ADD_WORKSPACE: 'ADD_WORKSPACE', // Add new workspace to the list
  REMOVE_WORKSPACE: 'REMOVE_WORKSPACE', // Remove workspace from the list
  SET_WORKSPACES_LIST: 'SET_WORKSPACES_LIST', // Set new workspaces list
  SET_CURRENT_WORKSPACE: 'SET_CURRENT_WORKSPACE', // Set current user workspace,
  ADD_PENDING_MEMBER: 'ADD_PENDING_MEMBER', // Add user to workspace
  REMOVE_MEMBER: 'REMOVE_MEMBER', // Remove user from workspace
  REMOVE_PENDING_MEMBER: 'REMOVE_PENDING_MEMBER', // Remove pending user from workspace
  SET_WORKSPACE: 'SET_WORKSPACE', // Set workspace to user workspaces list
  UPDATE_MEMBER: 'UPDATE_MEMBER', // Update member in the workspace,
  SET_BUSINESS_OPERATIONS: 'SET_BUSINESS_OPERATIONS', // Set billing history
  SET_PLAN: 'SET_PLAN', // Set workspace tariff plan
};

/**
 * @typedef {object} Workspace - represents workspace
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 * @property {string} [image] - link to the workspace picture
 * @property {string} [description] - workspace description
 */

/**
 * Module state
 *
 * @typedef {object} WorkspacesModuleState
 * @property {Array<Workspace>} list - registered workspaces
 * @property {Workspace} current - current user workspace
 */

/**
 * Creates module state
 *
 * @returns {WorkspacesModuleState}
 */
function initialState() {
  return {
    list: [],
    current: null,
  };
}

/**
 * All Vuex getters will be stored under this namespace
 *
 * @namespace Getters
 */
const getters = {
  /**
   * Returns workspace by id
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @returns {function(string): Workspace}
   */
  getWorkspaceById: state =>
    /**
     * @param {string} id project id to find
     * @returns {Project}
     */
    id => state.list.find(workspace => workspace.id === id),

  /**
   * Returns current user in the provided workspace
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {object} getters - getters of the this module
   * @param {object} rootState - vuex root state
   * @returns {function(*): ConfirmedMember}
   */
  getCurrentUserInWorkspace: (state, getters, rootState) =>
    /**
     * @param workspace - workspace to get user
     * @returns {ConfirmedMember}
     */
    (workspace) => {
      const user = rootState.user.data;

      return workspace.team.find(_member => !isPendingMember(_member) && _member.user.id === user.id);
    },

  /**
   * Is current user admin in workspace
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {object} getters - getters of the this module
   * @param {object} rootState - vuex root state
   * @returns {function(*): boolean}
   */
  isCurrentUserAdmin: (state, getters, rootState) =>
    /**
     * @param workspaceId - workspace id to check
     * @returns {boolean}
     */
    (workspaceId) => {
      const workspace = getters.getWorkspaceById(workspaceId);
      const userId = rootState.user.data.id;

      return workspace.team.some(member => member.user.id === userId && member.isAdmin);
    },
};

const actions = {
  /**
   * Send request to create new workspace
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace params for creation
   * @returns {Workspace} - created workspace
   */
  async [CREATE_WORKSPACE]({ commit }, workspace) {
    const createdWorkspace = await workspaceApi.createWorkspace(workspace);

    commit(mutationTypes.ADD_WORKSPACE, createdWorkspace);

    return createdWorkspace;
  },

  /**
   * Send request to delete workspace
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - standard Vuex commit function
   * @param {Function} context.dispatch - standard Vuex dispatch function
   * @param {string} workspaceId - id of workspace for deleting
   */
  async [LEAVE_WORKSPACE]({ commit, dispatch }, workspaceId) {
    await workspaceApi.leaveWorkspace(workspaceId);

    dispatch(REMOVE_PROJECTS_BY_WORKSPACE_ID, workspaceId);
    commit(mutationTypes.SET_CURRENT_WORKSPACE, null);
    commit(mutationTypes.REMOVE_WORKSPACE, workspaceId);
  },

  /**
   * Sent request to invite user to workspace
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - standard Vuex commit function
   *
   * @param {object} payload - vuex action payload
   * @param {string} payload.workspaceId - id of workspace to which user is invited
   * @param {string} payload.userEmail - email of the invited user
   */
  async [INVITE_TO_WORKSPACE]({ commit }, { workspaceId, userEmail }) {
    const success = await workspaceApi.inviteToWorkspace(workspaceId, userEmail);

    if (!success) {
      return false;
    }

    commit(mutationTypes.ADD_PENDING_MEMBER, {
      workspaceId,
      data: {
        email: userEmail,
      },
    });

    return true;
  },

  /**
   * Send request to confirm user invitation
   *
   * @param {object} context - vuex action context
   *
   * @param {object} payload - vuex action payload
   * @param {string} payload.workspaceId - id of workspace to which user is invited
   * @param {string} payload.inviteHash - hash passed to the invite link
   */
  async [CONFIRM_INVITE](context, { workspaceId, inviteHash }) {
    await workspaceApi.confirmInvite(workspaceId, inviteHash);
  },

  /**
   * Sets current user workspace
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {Workspace} workspace - new current user workspace
   */
  [SET_CURRENT_WORKSPACE]({ commit }, workspace) {
    commit(SET_CURRENT_WORKSPACE, workspace);
  },

  /**
   * Sets new workspaces list
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {[Workspace]} workspaces - new workspaces list
   */
  [SET_WORKSPACES_LIST]({ commit }, workspaces) {
    commit(SET_WORKSPACES_LIST, workspaces);
  },

  /**
   * Get workspaces by ids
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {number} id – workspace id to fetch
   * @returns {Promise<Workspace>}
   */
  async [FETCH_WORKSPACE]({ commit }, id) {
    const workspace = (await workspaceApi.getWorkspaces([ id ]))[0];

    commit(mutationTypes.SET_WORKSPACE, workspace);

    return workspace;
  },

  /**
   * Update workspace data
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace to update
   * @returns {Promise<boolean>}
   */
  async [UPDATE_WORKSPACE]({ commit }, workspace) {
    const isSaved = await workspaceApi.updateWorkspace(workspace.id, workspace.name, workspace.description, workspace.image);

    if (isSaved) {
      commit(mutationTypes.SET_WORKSPACE, workspace);
    }

    return isSaved;
  },

  /**
   * Grant admin permissions
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - standard Vuex commit method
   *
   * @param {object} payload - vuex action payload
   * @param {string} payload.workspaceId - id of workspace where user is participate
   * @param {string} payload.userId - id of user to grant permissions
   * @param {boolean} payload.state - if true, grant permissions, if false, withdraw them
   *
   * @returns {Promise<boolean>}
   */
  async [GRANT_ADMIN_PERMISSIONS]({ commit }, { workspaceId, userId, state = true }) {
    const success = await workspaceApi.grantAdminPermissions(workspaceId, userId, state);

    if (!success) {
      return false;
    }

    const changes = {
      isAdmin: state,
    };

    commit(mutationTypes.UPDATE_MEMBER, {
      workspaceId,
      userId,
      changes,
    });
  },

  /**
   * Remove user from workspace
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - standard Vuex dispatch methods
   *
   * @param {object} payload - vuex action payload
   * @param {string} payload.workspaceId - id of workspace where user is participate
   * @param {string} payload.userId - id of user to remove
   * @param {string} payload.userEmail - user email to remove (instead of id)
   *
   * @returns {Promise<*>}
   */
  async [REMOVE_USER_FROM_WORKSPACE]({ commit }, { workspaceId, userId, userEmail }) {
    const success = await workspaceApi.removeUserFromWorkspace(workspaceId, userId, userEmail);

    if (!success) {
      return;
    }

    if (userId) {
      commit(mutationTypes.REMOVE_MEMBER, {
        workspaceId,
        userId,
      });
    } else {
      commit(mutationTypes.REMOVE_PENDING_MEMBER, {
        workspaceId,
        userEmail,
      });
    }
  },

  /**
   * Fetch payment operations and save them to the store
   *
   * @param {Function} commit - standard Vuex commit method
   * @param {string[]} ids - workspaces ids
   * @returns {Promise<void>}
   */
  async [GET_BUSINESS_OPERATIONS]({ commit }, { ids }) {
    const operations = await billingApi.getBusinessOperations(ids);

    console.log('operations', operations);

    commit(mutationTypes.SET_BUSINESS_OPERATIONS, operations || []);
  },

  /**
   * Call change plan mutation
   *
   * @param {Function} commit - VueX commit method
   * @param {object} getters - Store getters
   * @param {string} workspaceId - id of workspace to change plan
   * @param {string} planId - id of plan to set
   * @returns {Promise<void>}
   */
  async [CHANGE_WORKSPACE_PLAN]({ commit, getters }, { workspaceId, planId }) {
    await workspaceApi.changePlan(workspaceId, planId);

    commit(mutationTypes.SET_PLAN, {
      workspaceId,
      plan: getters.getPlanById(planId),
    });
  },

  /**
   * Resets module state
   *
   * @param {Function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  },
};

const mutations = {
  /**
   * Set workspace data
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace} workspace - workspace params for setting
   */
  [mutationTypes.SET_WORKSPACE](state, workspace) {
    const index = state.list.findIndex(element => element.id === workspace.id);

    if (state.current && workspace.id === state.current.id) {
      state.current = workspace;
    }

    state.list = [
      ...state.list.slice(0, index),
      {
        ...state.list[index],
        ...workspace,
      },
      ...state.list.slice(index + 1),
    ];
  },

  /**
   * Mutation for adding new workspace
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace} workspace - workspace params for creation
   */
  [mutationTypes.ADD_WORKSPACE](state, workspace) {
    state.list.push(workspace);
  },

  /**
   * Mutation for deleting workspaces
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {string} workspaceId - id of workspace for deleting
   */
  [mutationTypes.REMOVE_WORKSPACE](state, workspaceId) {
    let index = null;

    state.list.find((element, i) => {
      if (element.id === workspaceId) {
        index = i;
      }
    });
    if (index !== null) {
      state.list.splice(index, 1);
    }
  },

  /**
   * Mutation for replacing workspaces list
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Array<Workspace>} newList - new list of workspaces
   */
  [mutationTypes.SET_WORKSPACES_LIST](state, newList) {
    Vue.set(state, 'list', newList);
  },

  /**
   * Sets current user workspace
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace | null} workspace - new current user workspace
   */
  [mutationTypes.SET_CURRENT_WORKSPACE](state, workspace) {
    state.current = workspace;
  },

  /**
   * Update member in the user list
   *
   * @param {WorkspacesModuleState} state - current state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.workspaceId - id of workspace where user should be updated
   * @param {string} payload.userId - id of user to update
   * @param {object} payload.changes - changes to update
   */
  [mutationTypes.UPDATE_MEMBER](state, { workspaceId, userId, changes }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);
    const memberIndex = state.list[workspaceIndex].team.findIndex(member => !isPendingMember(member) && member.user.id === userId);

    Object.assign(state.list[workspaceIndex].team[memberIndex], changes);
  },

  /**
   * Add pending member to workspace
   *
   * @param {WorkspacesModuleState} state - current state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.workspaceId - id of workspace to which user should be added
   * @param {object} payload.data - user data
   */
  [mutationTypes.ADD_PENDING_MEMBER](state, { workspaceId, data }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);

    state.list[workspaceIndex].team.push(data);
  },

  /**
   * Remove member from workspace
   *
   * @param {WorkspacesModuleState} state - current state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.workspaceId - id of workspace from which user should be removed
   * @param {string} payload.userId - id of user to remove
   */
  [mutationTypes.REMOVE_MEMBER](state, { workspaceId, userId }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);
    const memberIndex = state.list[workspaceIndex].team.findIndex(member => member.user.id === userId);

    if (memberIndex > -1) {
      state.list[workspaceIndex].team.splice(memberIndex, 1);
    }
  },

  /**
   * Remove pending member from workspace
   *
   * @param {WorkspacesModuleState} state - current state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.workspaceId - id of workspace from which user should be removed
   * @param {string} payload.userEmail - email of user to remove
   */
  [mutationTypes.REMOVE_PENDING_MEMBER](state, { workspaceId, userEmail }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);
    const memberIndex = state.list[workspaceIndex].team.findIndex(m => m.email === userEmail);

    if (memberIndex > -1) {
      state.list[workspaceIndex].team.splice(memberIndex, 1);
    }
  },

  /**
   * Set transactions info to workspaces by ids
   *
   * @param {WorkspacesModuleState} state - current state
   * @param {BusinessOperation[]} operations - operations to set
   */
  [mutationTypes.SET_BUSINESS_OPERATIONS](state, operations = []) {
    /**
     * Group all operations by payload.workspace.id
     * {
     *   [workspace.id] => BusinessOperation,
     *   ...
     * }
     */
    const groupedByWorkspaceId = operations.reduce(
      (acc, operation) => {
        const { workspace } = operation.payload;

        if (!acc[workspace.id]) {
          acc[workspace.id] = [];
        }

        acc[workspace.id].push(operation);

        return acc;
      },
      {}
    );

    Object.entries(groupedByWorkspaceId)
      .forEach(([workspaceId, operationsOfWorkspace]) => {
        const index = state.list.findIndex(w => w.id === workspaceId);
        const workspace = state.list[index];

        Vue.set(workspace, 'paymentsHistory', operationsOfWorkspace);

        state.list = [
          ...state.list.slice(0, index),
          workspace,
          ...state.list.slice(index + 1),
        ];
      }
    );
  },

  /**
   * Set workspace plan
   *
   * @param {object} state - module state
   * @param {string} workspaceId - id of workspace to set plan
   * @param {Plan} plan - plan to set
   */
  [mutationTypes.SET_PLAN](state, { workspaceId, plan }) {
    const index = state.list.findIndex(w => w.id === workspaceId);
    const workspace = state.list[index];

    Vue.set(workspace, 'plan', plan);

    state.list = [
      ...state.list.slice(0, index),
      workspace,
      ...state.list.slice(index + 1),
    ];
  },

  /**
   * Resets module state
   *
   * @param {WorkspacesModuleState} state - Vuex state
   */
  [RESET_STORE](state) {
    Object.assign(state, initialState());
  },
};

export default {
  state: initialState(),
  getters,
  actions,
  mutations,
};
