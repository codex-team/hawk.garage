/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { CREATE_WORKSPACE, ADD_WORKSPACE, DELETE_WORKSPACE } from '../actions/workspaces';
import * as workspaceApi from '../../api/workspaces';

/**
 * @typedef Workspace - represents workspace
 * @type {object}
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 */

/**
 * Module state
 * @typedef WorkspacesModuleState
 * @type {object}
 * @property {array<Workspace>} list - registered workspaces
 */
const state = {
  list: []
};

const getters = {
  /**
   * Returns number of user's workspaces
   * @param {WorkspacesModuleState} state - Vuex state
   * @return {number}
   */
  count: state => state.list.length
};

const actions = {
  /**
   * Send request to create new workspace
   * @param {function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace params for creation
   */
  async [CREATE_WORKSPACE]({ commit }, workspace) {
    const response = await workspaceApi.createWorkspace(workspace);

    commit(ADD_WORKSPACE, response);
  },

  /**
   * Send request to delete workspace
   * @param {function} commit - standard Vuex commit function
   * @param {string} workspaceId - id of workspace for deleting
   */
  async [DELETE_WORKSPACE]({ commit }, workspaceId) {
    await workspaceApi.deleteWorkspace(workspaceId);

    commit(DELETE_WORKSPACE, workspaceId);
  }
};

const mutations = {
  /**
   * Mutation for adding new workspace
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace} workspace - workspace params for creation
   */
  [ADD_WORKSPACE](state, workspace) {
    state.list.push(workspace);
  },

  /**
   * Mutation for deleting workspaces
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {string} workspaceId - id of workspace for deleting
   */
  [DELETE_WORKSPACE](state, workspaceId) {
    state.list.find(element => {
      if (element.id === workspaceId) {
        state.list.splice(element, 1);
      }
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
