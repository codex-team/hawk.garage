/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { CREATE_WORKSPACE, ADD_WORKSPACE } from '../actions/workspaces';

/**
 * @typedef Workspace - represents workspace
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 */

/**
 * Temporary mockup api
 */
const apiMockup = {
  createWorkspace(workspace) {
    return { id: 'awedwer23re3we23ed23de', name: workspace.name };
  }
};

/**
 * Module state
 * @typedef WorkspacesModuleState
 * @type {object}
 */
const state = {
  workspaces: []
};

const getters = {
  /**
   * Returns true if the user is authenticated else false
   * @param {AuthModuleState} state - vuex state
   * @return {boolean}
   */
  isAuthenticated: state => !!state.token
};

const actions = {
  /**
   * Send sign up request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {function} dispatch - standard Vuex dispatch function
   * @param {Workspace} user - workspace params for creation
   */
  async [CREATE_WORKSPACE]({ commit, dispatch }, workspace) {
    try {
      const response = await apiMockup.createWorkspace(workspace);

      commit(ADD_WORKSPACE, response);
    } catch (e) {
      throw e;
    }
  }
};

const mutations = {
  /**
   * Mutation caused by authentication request
   * @param {object} state - Vuex state
   */
  [ADD_WORKSPACE](state, workspace) {
    state.workspaces.push(workspace);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
