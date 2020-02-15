/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  CREATE_WORKSPACE,
  SET_WORKSPACES_LIST,
  REMOVE_WORKSPACE,
  SET_CURRENT_WORKSPACE,
  INVITE_TO_WORKSPACE,
  CONFIRM_INVITE,
  UPDATE_WORKSPACE,
  FETCH_WORKSPACE,
  GRANT_ADMIN_PERMISSIONS,
  REMOVE_USER_FROM_WORKSPACE,
  GET_TRANSACTIONS,
  FETCH_WORKSPACES
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as workspaceApi from '../../../api/workspaces/index.ts';
import * as billingApi from '../../../api/billing';
import Vue from 'vue';

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
  SET_TRANSACTIONS: 'SET_TRANSACTIONS' // Set transactions info
};

/**
 * @typedef {object} Workspace - represents workspace
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 * @property {String} [image] - link to the workspace picture
 * @property {String} [description] - workspace description
 */

/**
 * Module state
 * @typedef {object} WorkspacesModuleState
 * @property {array<Workspace>} list - registered workspaces
 * @property {Workspace} current - current user workspace
 */

/**
 * Creates module state
 * @return {WorkspacesModuleState}
 */
function initialState() {
  return {
    list: [],
    current: null
  };
}

const getters = {
  /**
   * Returns workspace by id
   * @param {WorkspacesModuleState} state - Vuex state
   * @return {function(String): Workspace}
   */
  getWorkspaceById: state =>
  /**
   * @param {String} id project id to find
   * @return {Project}
   */
    id => state.list.find(workspace => workspace.id === id)
};

const actions = {
  /**
   * Send request to create new workspace
   * @param {function} commit - standard Vuex commit function
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
   * @param {function} commit - standard Vuex commit function
   * @param {string} workspaceId - id of workspace for deleting
   */
  async [REMOVE_WORKSPACE]({ commit }, workspaceId) {
    await workspaceApi.removeWorkspace(workspaceId);

    commit(mutationTypes.REMOVE_WORKSPACE, workspaceId);
  },

  /**
   * Sent request to invite user to workspace
   * @param {function} commit - standard Vuex commit function
   * @param {string} workspaceId - id of workspace to which user is invited
   * @param {string} userEmail - email of the invited user
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
        isPending: true
      }
    });

    return true;
  },

  /**
   * Send request to confirm user invitation
   *
   * @param {function} commit - standard Vuex commit function
   * @param {string} workspaceId - id of workspace to which user is invited
   * @param {string} inviteHash - hash passed to the invite link
   */
  async [CONFIRM_INVITE]({ commit }, { workspaceId, inviteHash }) {
    await workspaceApi.confirmInvite(workspaceId, inviteHash);
  },

  /**
   * Sets current user workspace
   * @param {function} commit - standard Vuex commit function
   * @param {Workspace} workspace - new current user workspace
   */
  [SET_CURRENT_WORKSPACE]({ commit }, workspace) {
    commit(SET_CURRENT_WORKSPACE, workspace);
  },

  /**
   * Sets new workspaces list
   * @param {function} commit - standard Vuex commit function
   * @param {[Workspace]} workspaces - new workspaces list
   */
  [SET_WORKSPACES_LIST]({ commit }, workspaces) {
    commit(SET_WORKSPACES_LIST, workspaces);
  },

  /**
   * Get workspaces by ids
   * @param {function} commit - standard Vuex commit function
   * @param {number} id – workspace id to fetch
   * @return {Promise<Workspace>}
   */
  async [FETCH_WORKSPACE]({ commit }, id) {
    const workspace = (await workspaceApi.getWorkspaces([ id ]))[0];

    commit(mutationTypes.SET_WORKSPACE, workspace);

    return workspace;
  },

  /**
   * Get workspaces by ids
   * @param {function} commit - standard Vuex commit function
   * @return {Promise<Workspace>}
   */
  async [FETCH_WORKSPACES]({ commit }) {
    const workspaces = (await workspaceApi.getWorkspaces([]));

    commit(mutationTypes.SET_WORKSPACES_LIST, workspaces);
  },

  /**
   * Update workspace data
   * @param {function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace to update
   * @returns {Promise<Boolean>}
   */
  async [UPDATE_WORKSPACE]({ commit }, workspace) {
    return workspaceApi.updateWorkspace(workspace.id, workspace.name, workspace.description, workspace.image);
  },

  /**
   * Grant admin permissions
   *
   * @param {function} commit - standard Vuex commit method
   * @param {string} workspaceId - id of workspace where user is participate
   * @param {string} userId - id of user to grant permissions
   * @param {boolean} state - if true, grant permissions, if false, withdraw them
   * @returns {Promise<Boolean>}
   */
  async [GRANT_ADMIN_PERMISSIONS]({ commit }, { workspaceId, userId, state = true }) {
    const success = await workspaceApi.grantAdminPermissions(workspaceId, userId, state);

    if (!success) {
      return false;
    }

    const changes = {
      isAdmin: state
    };

    commit(mutationTypes.UPDATE_MEMBER, {
      workspaceId,
      userId,
      changes
    });
  },

  /**
   * Remove user from workspace
   *
   * @param {function} commit - standard Vuex dispatch methods
   * @param {string} workspaceId - id of workspace where user is participate
   * @param {string} userId - id of user to remove
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
        userId
      });
    } else {
      commit(mutationTypes.REMOVE_PENDING_MEMBER, {
        workspaceId,
        userEmail
      });
    }
  },

  /**
   * Fetch transactions and set them to store
   * @param {function} commit - standard Vuex commit method
   * @param {string[]} ids - workspaces ids
   * @returns {Promise<void>}
   */
  async [GET_TRANSACTIONS]({ commit }, { ids }) {
    const transactions = await billingApi.getTransactions(ids);

    commit(mutationTypes.SET_TRANSACTIONS, transactions || []);
  },

  /**
   * Resets module state
   * @param {function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  }
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
        ...workspace
      },
      ...state.list.slice(index + 1)
    ];
  },

  /**
   * Mutation for adding new workspace
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace} workspace - workspace params for creation
   */
  [mutationTypes.ADD_WORKSPACE](state, workspace) {
    state.list.push(workspace);
  },

  /**
   * Mutation for deleting workspaces
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
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Array<Workspace>} newList - new list of workspaces
   */
  [mutationTypes.SET_WORKSPACES_LIST](state, newList) {
    Vue.set(state, 'list', newList);
  },

  /**
   * Sets current user workspace
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace} workspace - new current user workspace
   */
  [mutationTypes.SET_CURRENT_WORKSPACE](state, workspace) {
    state.current = workspace;
  },

  /**
   * Update member in the user list
   *
   * @param {WorkspacesModuleState} state - current state
   * @param {string} workspaceId - id of workspace where user should be updated
   * @param {string} userId - id of user to update
   * @param {object} changes - changes to update
   */
  [mutationTypes.UPDATE_MEMBER](state, { workspaceId, userId, changes }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);
    const memberIndex = state.list[workspaceIndex].users.findIndex(u => u.id === userId);

    Object.assign(state.list[workspaceIndex].users[memberIndex], changes);
  },

  /**
   * Add pending member to workspace
   *
   * @param {WorkspacesModuleState} state - current state
   * @param {string} workspaceId - id of workspace to which user should be added
   * @param {object} data - user data
   */
  [mutationTypes.ADD_PENDING_MEMBER](state, { workspaceId, data }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);

    if (!state.list[workspaceIndex].pendingUsers) {
      Vue.set(state.list[workspaceIndex], 'pendingUsers', []);
    }

    state.list[workspaceIndex].pendingUsers.push(data);
  },

  /**
   * Remove member from workspace
   *
   * @param {WorkspacesModuleState} state - current state
   * @param {string} workspaceId - id of workspace from which user should be removed
   * @param {string} userId - id of user to remove
   */
  [mutationTypes.REMOVE_MEMBER](state, { workspaceId, userId }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);
    const memberIndex = state.list[workspaceIndex].users.findIndex(m => m.id === userId);

    if (memberIndex > -1) {
      state.list[workspaceIndex].users.splice(memberIndex, 1);
    }
  },

  /**
   * Remove pending member from workspace
   *
   * @param {WorkspacesModuleState} state - current state
   * @param {string} workspaceId - id of workspace from which user should be removed
   * @param {string} userEmail - email of user to remove
   */
  [mutationTypes.REMOVE_PENDING_MEMBER](state, { workspaceId, userEmail }) {
    const workspaceIndex = state.list.findIndex(w => w.id === workspaceId);
    const memberIndex = state.list[workspaceIndex].pendingUsers.findIndex(m => m.email === userEmail);

    if (memberIndex > -1) {
      state.list[workspaceIndex].pendingUsers.splice(memberIndex, 1);
    }
  },

  /**
   * Set transactions info to workspaces by ids
   * @param {WorkspacesModuleState} state - current state
   * @param {Transaction[]} transactions - transactions to set
   */
  [mutationTypes.SET_TRANSACTIONS](state, transactions = []) {
    const groupedByWorkspaceId = transactions.reduce(
      (acc, transaction) => {
        const { workspace } = transaction;

        if (!acc[workspace.id]) {
          acc[workspace.id] = [];
        }

        acc[workspace.id].push(transaction);

        return acc;
      },
      {}
    );

    Object.entries(groupedByWorkspaceId).forEach(([workspaceId, data]) => {
      const index = state.list.findIndex(w => w.id === workspaceId);

      const workspace = state.list[index];

      Vue.set(workspace, 'transactions', data);

      state.list = [
        ...state.list.slice(0, index),
        workspace,
        ...state.list.slice(index + 1)
      ];
    });
  },

  /**
   * Resets module state
   * @param {WorkspacesModuleState} state - Vuex state
   */
  [RESET_STORE](state) {
    Object.assign(state, initialState());
  }
};

export default {
  state: initialState(),
  getters,
  actions,
  mutations
};
