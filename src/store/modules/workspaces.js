/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  CREATE_WORKSPACE,
  ADD_WORKSPACE,
  REMOVE_WORKSPACE,
  FETCH_WORKSPACES,
  SET_WORKSPACES
} from '../actions/workspaces';
import { RESET_STORE } from '../actions';
import * as workspaceApi from '../../api/workspaces';
import Vue from 'vue';

/**
 * @typedef {object} Workspace - represents workspace
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 * @property {String} picture - link to the workspace picture
 * @property {[Project]} projects - projects associated with workspace
 */

/**
 * @typedef {object} Project - represent project in workspace
 * @property {String} id - project id
 * @property {String} name - project name
 */

/**
 * Module state
 * @typedef {object} WorkspacesModuleState
 * @property {array<Workspace>} list - registered workspaces
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
   * Returns number of user's workspaces
   * @param {WorkspacesModuleState} state - Vuex state
   * @return {number}
   */
  count: state => state.list.length,

  /**
   * Returns all projects in all workspaces
   * @param {WorkspacesModuleState} state - Vuex state
   * @return {Array<Project>}
   */
  allProjects: state => state.list.reduce((accumulator, workspace) => {
    if (workspace.projects) {
      accumulator.push(...workspace.projects);
    }
    return accumulator;
  }, []),

  /**
   * Returns project by id
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {object} getters - Vuex getters
   * @return {function(String): Project}
   */
  project: (state, getters) =>
    /**
     * @param {String} id project id to find
     * @return {Project}
     */
    id => getters.allProjects.find(project => project.id === id)
};

const actions = {
  /**
   * Send request to create new workspace
   * @param {function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace params for creation
   * @returns {Workspace} - created workspace
   */
  async [CREATE_WORKSPACE]({ commit }, workspace) {
    const createWorkspace = await workspaceApi.createWorkspace(workspace);

    commit(ADD_WORKSPACE, createWorkspace);
    return createWorkspace;
  },

  /**
   * Send request to delete workspace
   * @param {function} commit - standard Vuex commit function
   * @param {string} workspaceId - id of workspace for deleting
   */
  async [REMOVE_WORKSPACE]({ commit }, workspaceId) {
    await workspaceApi.deleteWorkspace(workspaceId);

    commit(REMOVE_WORKSPACE, workspaceId);
  },

  /**
   * Send query request to get information about all workspaces
   * @param {function} commit - standard Vuex commit function
   * @return {Promise<void>}
   */
  async [FETCH_WORKSPACES]({ commit }) {
    const workspaces = await workspaceApi.getAllWorkspacesWithProjects();

    commit(SET_WORKSPACES, workspaces);
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
  [ADD_WORKSPACE](state, workspace) {
    state.list.push(workspace);
  },

  /**
   * Mutation for deleting workspaces
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {string} workspaceId - id of workspace for deleting
   */
  [REMOVE_WORKSPACE](state, workspaceId) {
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
  [SET_WORKSPACES](state, newList) {
    Vue.set(state, 'list', newList);
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
