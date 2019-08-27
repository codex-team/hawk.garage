/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  CREATE_WORKSPACE,
  SET_WORKSPACES_LIST,
  REMOVE_WORKSPACE,
  SET_CURRENT_WORKSPACE,
  INVITE_TO_WORKSPACE,
  CONFIRM_INVITE,
  UPDATE_WORKSPACE,
  FETCH_WORKSPACE
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as workspaceApi from '../../../api/workspaces';
import Vue from 'vue';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  ADD_WORKSPACE: 'ADD_WORKSPACE', // Add new workspace to the list
  REMOVE_WORKSPACE: 'REMOVE_WORKSPACE', // Remove workspace from the list
  SET_WORKSPACES_LIST: 'SET_WORKSPACES_LIST', // Set new workspaces list
  SET_CURRENT_WORKSPACE: 'SET_CURRENT_WORKSPACE', // Set current user workspace,
  INVITE_TO_WORKSPACE: 'INVITE_TO_WORKSPACE', // Invite user to workspace
  CONFIRM_INVITE: 'CONFIRM_INVITE', // Confirm user invitation
  SET_WORKSPACE: 'SET_WORKSPACE' // Set workspace to user workspaces list
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
    await workspaceApi.deleteWorkspace(workspaceId);

    commit(mutationTypes.REMOVE_WORKSPACE, workspaceId);
  },

  /**
   * Sent request to invite user to workspace
   * @param {function} commit - standard Vuex commit function
   * @param {string} workspaceId - id of workspace to which user is invited
   * @param {string} userEmail - email of the invited user
   */
  async [INVITE_TO_WORKSPACE]({ commit }, { workspaceId, userEmail }) {
    await workspaceApi.inviteToWorkspace(workspaceId, userEmail);
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
   * Update workspace data
   * @param {function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace to update
   * @returns {Promise<Boolean>}
   */
  async [UPDATE_WORKSPACE]({ commit }, workspace) {
    return workspaceApi.updateWorkspace(workspace.id, workspace.name, workspace.description);
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

    Vue.set(state.list, index, workspace);
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
      if (element.id === workspaceId) index = i;
    });
    if (index !== null) state.list.splice(index, 1);
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
