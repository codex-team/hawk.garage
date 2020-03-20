/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  CREATE_PROJECT,
  FETCH_RECENT_ERRORS,
  SET_PROJECTS_LIST,
  UPDATE_PROJECT_LAST_VISIT
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as projectsApi from '../../../api/projects';
import Vue from 'vue';
import { groupByGroupingTimestamp } from '../../../utils';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  ADD_PROJECT: 'ADD_PROJECT', // Add new project to the projects list
  SET_PROJECTS_LIST: 'SET_PROJECTS_LIST', // Set new projects list
  SET_EVENTS_LIST_BY_DATE: 'SET_EVENTS_LIST_BY_DATE', // Set events list by date to project
  RESET_PROJECT_UNREAD_COUNT: 'SET_PROJECT_UNREAD_COUNT', // Set project unread count
};

/**
 * @typedef {object} Project - represent project in workspace
 * @property {String} id - project id
 * @property {String} name - project name
 * @property {String} workspaceId - ID of the workspace to which the project belongs
 * @property {String} [image] - project image
 * @property {Number} unreadCount - project's "unreadCount" badge
 * @property {EventsListByDate} eventsListByDate - last projects event
 */

/**
 * @typedef {Object<string, [RecentError]>} EventsListByDate
 */

/**
 * @typedef {Object} RecentError
 * @property {String} date - error date
 * @property {String} error - occurred error
 * @property {String} count - count of the errors of this type
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
    list: [],
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
    id => state.list.find(project => project.id === id),
};

const actions = {
  /**
   * Send request to create new project
   * @param {function} commit - standard Vuex commit function
   * @param {Project} projectData - project params for creation
   * @return {Promise<void>}
   */
  async [CREATE_PROJECT]({ commit }, projectData) {
    const newProjectData = await projectsApi.createProject(projectData);

    newProjectData.workspaceId = projectData.workspaceId;
    commit(mutationTypes.ADD_PROJECT, newProjectData);
  },

  /**
   * Fetch latest project events
   * @param {function} commit - standard Vuex commit function
   * @param {String} projectId - id of the project to fetch
   * @return {Promise<void>}
   */
  async [FETCH_RECENT_ERRORS]({ commit }, projectId) {
    const recentEvents = await projectsApi.fetchRecentErrors(projectId);

    const eventsListByDate = groupByGroupingTimestamp(recentEvents);

    commit(mutationTypes.SET_EVENTS_LIST_BY_DATE, {
      projectId,
      eventsListByDate,
    });
  },

  /**
   * @param {Function} commit - standard Vuex commit function
   * @param {Object} getters - standard Vuex getters
   * @param {String} projectId - project's identifier
   * @return {Promise<void>}
   */
  async [UPDATE_PROJECT_LAST_VISIT]({ commit, getters }, { projectId }) {
    await projectsApi.updateLastProjectVisit(projectId);

    commit(mutationTypes.RESET_PROJECT_UNREAD_COUNT, { projectId });
  },

  /**
   * Sets new projects list
   * @param {function} commit - standard Vuex commit function
   * @param {[Project]} projects - new projects list
   */
  [SET_PROJECTS_LIST]({ commit }, projects) {
    commit(mutationTypes.SET_PROJECTS_LIST, projects);
  },

  /**
   * Resets module state
   * @param {function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  },
};

const mutations = {
  /**
   * Mutation for replacing projects list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of projects
   */
  [mutationTypes.SET_PROJECTS_LIST](state, newList) {
    Vue.set(state, 'list', newList);
  },

  /**
   * Add project to the list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Project} project - project to add
   */
  [mutationTypes.ADD_PROJECT](state, project) {
    state.list.push(project);
  },

  /**
   * @param {ProjectsModuleState} state - Vuex state
   * @param {String} projectId - id of the project to set data
   * @param {EventsListByDate} eventsListByDate - new event list
   */
  [mutationTypes.SET_EVENTS_LIST_BY_DATE](state, { projectId, eventsListByDate }) {
    const project = state.list.find(_project => _project.id === projectId);

    Vue.set(project, 'eventsListByDate', eventsListByDate);
  },

  /**
   * @param {ProjectsModuleState} state - Vuex state
   * @param {String} projectId - id of the project to set data
   */
  [mutationTypes.RESET_PROJECT_UNREAD_COUNT](state, { projectId }) {
    const project = state.list.find(_project => _project.id === projectId);

    Vue.set(project, 'unreadCount', 0);
  },

  /**
   * Resets module state
   * @param {ProjectsModuleState} state - Vuex state
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
