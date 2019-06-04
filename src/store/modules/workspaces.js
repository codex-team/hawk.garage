/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import {
  CREATE_WORKSPACE,
  ADD_WORKSPACE,
  DELETE_WORKSPACE,
  FETCH_WORKSPACES,
  SET_WORKSPACES_LIST
} from '../actions/workspaces';
import * as workspaceApi from '../../api/workspaces';
import Vue from 'vue';

/**
 * @typedef Workspace - represents workspace
 * @type {object}
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 * @property {String} picture - link to the workspace picture
 * @property {[Project]} project - projects associated with workspace
 */

/**
 * @typedef Project - represent project in workspace
 * @type {object}
 * @property {String} id - project id
 * @property {String} name - project name
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
  count: state => state.list.length,
  allProjects: state => state.list.reduce((accumulator, workspace) => {
    accumulator.push(...workspace.projects);
    return accumulator;
  }, [])
};

const actions = {
  /**
   * Send request to create new workspace
   * @param {function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace params for creation
   * @returns {Workspace} - created workspace
   */
  async [CREATE_WORKSPACE]({ commit }, workspace) {
    const response = await workspaceApi.createWorkspace(workspace);

    commit(ADD_WORKSPACE, response);
    return response;
  },

  /**
   * Send request to delete workspace
   * @param {function} commit - standard Vuex commit function
   * @param {string} workspaceId - id of workspace for deleting
   */
  async [DELETE_WORKSPACE]({ commit }, workspaceId) {
    await workspaceApi.deleteWorkspace(workspaceId);

    commit(DELETE_WORKSPACE, workspaceId);
  },

  async [FETCH_WORKSPACES]({ commit }) {
    const workspaces = await workspaceApi.getAllWorkspacesAndProject();

    commit(SET_WORKSPACES_LIST, workspaces);
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
    let index = null;

    state.list.find((element, i) => {
      if (element.id === workspaceId) index = i;
    });
    if (index !== null) state.list.splice(index, 1);
  },

  [SET_WORKSPACES_LIST](state, newList) {
    Vue.set(state, 'list', newList);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
