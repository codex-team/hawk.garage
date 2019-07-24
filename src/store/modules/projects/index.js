/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  ADD_PROJECT,
  CREATE_PROJECT,
  SET_PROJECTS_LIST
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as projectsApi from '../../../api/projects';
import Vue from 'vue';

/**
 * @typedef {object} Project - represent project in workspace
 * @property {String} id - project id
 * @property {String} name - project name
 * @property {String} workspaceId - ID of the workspace to which the project belongs
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
   * @param {Project} projectData - project params for creation
   * @return {Promise<void>}
   */
  async [CREATE_PROJECT]({ commit }, projectData) {
    const newProjectData = await projectsApi.createProject(projectData);

    newProjectData.workspaceId = projectData.workspaceId;
    commit(ADD_PROJECT, newProjectData);
  },

  /**
   * Sets new projects list
   * @param {function} commit - standard Vuex commit function
   * @param {[Project]} projects - new projects list
   */
  [SET_PROJECTS_LIST]({ commit }, projects) {
    commit(SET_PROJECTS_LIST, projects);
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
   * Mutation for replacing projects list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of projects
   */
  [SET_PROJECTS_LIST](state, newList) {
    Vue.set(state, 'list', newList);
  },

  [ADD_PROJECT](state, project) {
    state.list.push(project);
  },

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
