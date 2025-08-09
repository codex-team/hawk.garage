import {
  CREATE_WORKSPACE,
  SET_WORKSPACES_LIST,
  LEAVE_WORKSPACE,
  SET_CURRENT_WORKSPACE,
  INVITE_TO_WORKSPACE,
  CONFIRM_INVITE,
  JOIN_BY_INVITE_LINK,
  UPDATE_WORKSPACE,
  FETCH_WORKSPACE,
  GRANT_ADMIN_PERMISSIONS,
  REMOVE_USER_FROM_WORKSPACE,
  GET_BUSINESS_OPERATIONS,
  GET_BALANCE,
  CHANGE_WORKSPACE_PLAN_FOR_FREE_PLAN,
  CANCEL_SUBSCRIPTION,
  PAY_WITH_CARD
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
  UPDATE_BUSINESS_OPERATIONS: 'UPDATE_BUSINESS_OPERATIONS', // Add a new business operation to the operations history
  UPDATE_BALANCE: 'UPDATE_BALANCE', // Update workspace balance
  SET_BUSINESS_OPERATIONS: 'SET_BUSINESS_OPERATIONS', // Set billing history
  SET_PLAN: 'SET_PLAN', // Set workspace tariff plan
  PUSH_BUSINESS_OPERATION: 'PUSH_BUSINESS_OPERATION', // push new business operation to workspace payments history
  SET_WORKSPACE_SUBSCRIPTION: 'SET_WORKSPACE_SUBSCRIPTION', // Set workspace subscription
};

/**
 * @typedef {object} Workspace - represents workspace
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 * @property {string} [image] - link to the workspace picture
 * @property {string} [description] - workspace description
 * @property {string|null} [subscriptionId] - id of subscription or null if there is no recurrent subscription
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
    id => state.events.find(workspace => workspace.id === id),

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

      return workspace.team.some(member => member.user && member.user.id === userId && member.isAdmin);
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
    const response = await workspaceApi.createWorkspace(workspace);
    const createdWorkspace = response.data.workspace;

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
    const response = await workspaceApi.inviteToWorkspace(workspaceId, userEmail);

    /**
     * Response can contain errors, so we should handle only existed fields
     */
    if (!response.data || !response.data.inviteToWorkspace) {
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
   * Send request to confirm user invitation
   *
   * @param {object} context - vuex action context
   * @param {object} payload - vuex action payload
   * @param {string} payload.inviteHash - hash passed to the invite link
   */
  async [JOIN_BY_INVITE_LINK](context, { inviteHash }) {
    await workspaceApi.joinByInviteLink(inviteHash);
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

    if (!workspace) {
      throw new Error('The workspace was not found');
    }
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

    commit(mutationTypes.SET_BUSINESS_OPERATIONS, operations || []);
  },

  /**
   * Process payment via saved card
   *
   * @param {Function} commit - standard Vuex commit method
   * @param {PayWithCardInput} args - data for payments
   * @returns {Promise<void>}
   */
  async [PAY_WITH_CARD]({ commit }, args) {
    const operation = await billingApi.payWithCard(args);

    commit(mutationTypes.PUSH_BUSINESS_OPERATION, operation);

    return operation;
  },

  /**
   * Fetch balance of workspace or workspaces
   *
   * @param {Function} commit - standard Vuex commit method
   * @param {string[]} ids - workspaces ids
   */
  async [GET_BALANCE]({ commit }, { ids }) {
    const balances = (await workspaceApi.getBalance(ids)) || [];

    balances.forEach(balanceWithId => {
      commit(mutationTypes.UPDATE_BALANCE, {
        workspaceId: balanceWithId.id,
        balance: balanceWithId.balance,
      });
    });
  },

  /**
   * Call change plan for free plan mutation
   *
   * @param {Function} commit - VueX commit method
   * @param {string} workspaceId - id of workspace to change plan
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  async [CHANGE_WORKSPACE_PLAN_FOR_FREE_PLAN]({ commit }, { workspaceId }) {
    const result = await workspaceApi.changePlanForFreePLan(workspaceId);

    commit(mutationTypes.SET_PLAN, {
      workspaceId,
      plan: result.record.plan,
      lastChargeDate: result.record.lastChargeDate,
    });

    return result;
  },

  /**
   * Call API to cancel subscription on workspace
   *
   * @param {Function} commit - VueX commit method
   * @param {string} workspaceId - id of workspace to change plan
   * @returns {Promise<void>}
   */
  async [CANCEL_SUBSCRIPTION]({ commit }, { workspaceId }) {
    const data = await workspaceApi.cancelSubscription(workspaceId);

    commit(mutationTypes.SET_WORKSPACE_SUBSCRIPTION, {
      id: data.id,
      subscriptionId: data.subscriptionId,
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
    const index = state.events.findIndex(element => element.id === workspace.id);

    if (state.current && workspace.id === state.current.id) {
      state.current = workspace;
    }

    state.events = [
      ...state.events.slice(0, index),
      {
        ...state.events[index],
        ...workspace,
      },
      ...state.events.slice(index + 1),
    ];
  },

  /**
   * Mutation for adding new workspace
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace} workspace - workspace params for creation
   */
  [mutationTypes.ADD_WORKSPACE](state, workspace) {
    state.events.push(workspace);
  },

  /**
   * Mutation for deleting workspaces
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {string} workspaceId - id of workspace for deleting
   */
  [mutationTypes.REMOVE_WORKSPACE](state, workspaceId) {
    let index = null;

    state.events.find((element, i) => {
      if (element.id === workspaceId) {
        index = i;
      }
    });
    if (index !== null) {
      state.events.splice(index, 1);
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
    const workspaceIndex = state.events.findIndex(w => w.id === workspaceId);
    const memberIndex = state.events[workspaceIndex].team.findIndex(member => !isPendingMember(member) && member.user.id === userId);

    Object.assign(state.events[workspaceIndex].team[memberIndex], changes);
  },

  /**
   * Add a new business operation to the workspace operations history
   *
   * @param {WorkspacesModuleState} state - current state
   * @param {string} payload.workspaceId - id of workspace where user should be updated
   * @param {BusinessOperation} payload.businessOperation - business operation to add to operations history
   */
  [mutationTypes.UPDATE_BUSINESS_OPERATIONS](state, { workspaceId, businessOperation }) {
    const index = state.events.findIndex(w => w.id === workspaceId);
    const workspace = state.events[index];
    let updatedPaymentsHistory = [ businessOperation ];

    if (workspace.paymentsHistory) {
      updatedPaymentsHistory = [ businessOperation ].concat(workspace.paymentsHistory);
    }

    Vue.set(workspace, 'paymentsHistory', updatedPaymentsHistory);
  },

  /**
   * Update workspace balance
   *
   * @param {WorkspacesModuleState} state - current state
   * @param {string} payload.workspaceId - id of workspace where user should be updated
   * @param {number} payload.amount - business operation to add to operations history
   */
  [mutationTypes.UPDATE_BALANCE](state, { workspaceId, balance }) {
    const index = state.events.findIndex(w => w.id === workspaceId);
    const workspace = state.events[index];

    Vue.set(workspace, 'balance', balance);
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
    const workspaceIndex = state.events.findIndex(w => w.id === workspaceId);

    state.events[workspaceIndex].team.push(data);
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
    const workspaceIndex = state.events.findIndex(w => w.id === workspaceId);
    const memberIndex = state.events[workspaceIndex].team.findIndex(member => member.user.id === userId);

    if (memberIndex > -1) {
      state.events[workspaceIndex].team.splice(memberIndex, 1);
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
    const workspaceIndex = state.events.findIndex(w => w.id === workspaceId);
    const memberIndex = state.events[workspaceIndex].team.findIndex(m => m.email === userEmail);

    if (memberIndex > -1) {
      state.events[workspaceIndex].team.splice(memberIndex, 1);
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
        const index = state.events.findIndex(w => w.id === workspaceId);
        const workspace = state.events[index];

        Vue.set(workspace, 'paymentsHistory', operationsOfWorkspace);

        state.events = [
          ...state.events.slice(0, index),
          workspace,
          ...state.events.slice(index + 1),
        ];
      }
      );
  },

  /**
   * Push new business operation to workspace payments history
   *
   * @param {object} state - module state
   * @param {BusinessOperation} operation - operation to push
   */
  [mutationTypes.PUSH_BUSINESS_OPERATION](state, operation) {
    const workspace = state.events.find(w => w.id === operation.payload.workspace.id);

    Vue.set(workspace, 'paymentsHistory', [operation, ...workspace.paymentsHistory]);
  },

  /**
   * Set workspace plan
   *
   * @param {object} state - module state
   * @param {string} workspaceId - id of workspace to set plan
   * @param {Plan} plan - plan to set
   */
  [mutationTypes.SET_PLAN](state, { workspaceId, plan, lastChargeDate }) {
    const index = state.events.findIndex(w => w.id === workspaceId);
    const workspace = state.events[index];

    Vue.set(workspace, 'plan', plan);
    Vue.set(workspace, 'lastChargeDate', lastChargeDate);

    state.events = [
      ...state.events.slice(0, index),
      workspace,
      ...state.events.slice(index + 1),
    ];
  },

  /**
   * Upate workspace subscription
   *
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace['id']} workspaceId - id of workspace
   * @param {Workspace['subscriptionId']} subscriptionId - id of subscription or null if subscription is canceled
   *
   * @todo TEST THIS METHOD.
   *       It should reset subscriptionId to null if subscription is canceled
   */
  [mutationTypes.SET_WORKSPACE_SUBSCRIPTION](state, { id, subscriptionId }) {
    console.log('SET_WORKSPACE_SUBSCRIPTION', id, subscriptionId);
    const index = state.events.findIndex(w => w.id === id);
    const workspace = state.events[index];

    console.log('workspace', workspace);

    Vue.set(workspace, 'subscriptionId', subscriptionId);

    state.events = [
      ...state.events.slice(0, index),
      workspace,
      ...state.events.slice(index + 1),
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
