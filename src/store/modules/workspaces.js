/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { CREATE_WORKSPACE, ADD_WORKSPACE } from '../actions/workspaces';
import uuid from 'uuid/v4';
import { WORKSPACES } from '../../constants/localStorageKeys';

/**
 * @typedef Workspace - represents workspace
 * @type {object}
 * @property {string} id - workspace id
 * @property {string} name - workspace name
 */

/**
 * Temporary mockup api
 */
const apiMockup = {
  createWorkspace(workspace) {
    return { id: uuid(), name: workspace.name };
  }
};

/**
 * Module state
 * @typedef WorkspacesModuleState
 * @type {object}
 * @property {array<Workspace>} workspaces - registered workspaces
 */
const state = initModule();

/**
 * Function for initialization Workspaces module
 * Loading data from localStorage
 * @return {WorkspacesModuleState}
 */
function initModule() {
  let workspaces;

  try {
    workspaces = JSON.parse(localStorage.getItem(WORKSPACES)) || [];
  } catch (e) {
    workspaces = [];
    localStorage.removeItem(WORKSPACES);
  }

  return {
    workspaces
  };
}

const actions = {
  /**
   * Send request to create new workspace
   * @param {function} commit - standard Vuex commit function
   * @param {Workspace} workspace - workspace params for creation
   */
  async [CREATE_WORKSPACE]({ commit }, workspace) {
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
   * Mutation for adding new workspace
   * @param {WorkspacesModuleState} state - Vuex state
   * @param {Workspace} workspace - workspace params for creation
   */
  [ADD_WORKSPACE](state, workspace) {
    state.workspaces.push(workspace);
    try {
      localStorage.setItem(WORKSPACES, JSON.stringify(state.workspaces));
    } catch (e) {
      console.log('Exception while saving workspaces to localStorage ', e);
    }
  }
};

export default {
  state,
  actions,
  mutations
};
