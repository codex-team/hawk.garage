/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  CREATE_WORKSPACE,
  SET_WORKSPACES_LIST,
  SET_CURRENT_WORKSPACE
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
  SET_CURRENT_WORKSPACE: 'SET_CURRENT_WORKSPACE' // Set current user workspace
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
   * Resets module state
   * @param {function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  }
};

const mutations = {
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
  actions,
  mutations
};
