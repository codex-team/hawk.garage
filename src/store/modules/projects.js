/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  CREATE_PROJECT
} from '../actions/projects';
import { RESET_STORE } from '../actions';
import * as workspaceApi from '../../api/workspaces';

/**
 * @typedef {object} Project - represent project in workspace
 * @property {String} id - project id
 * @property {String} name - project name
 * @property {String} [image] - project image
 */

/**
 * Module state
 * @typedef {object} ProjectsModuleState
 * @property {array<Project>} list - user's projects
 */

/**
 * Creates module state
 * @return {WorkspacesModuleState}
 */
function initialState() {
  return {
    list: []
  };
}

/**
 * Module getters
 */
const getters = {
  /**
   * Returns project by id
   * @param {ProjectsModuleState} state - Vuex state
   * @return {function(String): Project}
   */
  getProjectById: state =>
    /**
     * @param {String} id project id to find
     * @return {Project}
     */
    id => state.list.find(project => project.id === id)
};

const actions = {
  /**
   * Send request to create new project
   * @param {function} dispatch - standard Vuex dispatch function
   * @param {Project} project - project params for creation
   * @return {Promise<void>}
   */
  async [CREATE_PROJECT]({ dispatch }, project) {
    await workspaceApi.createProject(project);
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
   * Resets module state
   * @param {ProjectsModuleState} state - Vuex state
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
