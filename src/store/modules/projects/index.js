/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  CREATE_PROJECT,
  FETCH_RECENT_ERRORS,
  SET_PROJECTS_LIST,
  UPDATE_PROJECT_LAST_VISIT,
  UPDATE_PROJECT,
  ADD_NOTIFICATIONS_RULE,
  UPDATE_NOTIFICATIONS_RULE
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as projectsApi from '../../../api/projects';
import Vue from 'vue';
import { groupByGroupingTimestamp } from '../../../utils';

/**
 * Mutations enum for this module
 */
export const mutationTypes = {
  ADD_PROJECT: 'ADD_PROJECT', // Add new project to the projects list
  UPDATE_PROJECT: 'UPDATE_PROJECT', // Set new info about a project
  SET_PROJECTS_LIST: 'SET_PROJECTS_LIST', // Set new projects list
  SET_EVENTS_LIST_BY_DATE: 'SET_EVENTS_LIST_BY_DATE', // Set events list by date to project
  RESET_PROJECT_UNREAD_COUNT: 'SET_PROJECT_UNREAD_COUNT', // Set project unread count
  PUSH_NOTIFICATIONS_RULE: 'PUSH_NOTIFICATIONS_RULE', // append new created notify rule
  UPDATE_NOTIFICATIONS_RULE: 'UPDATE_NOTIFICATIONS_RULE', // reset updated notify rule
};

/**
 * @typedef {object} Project - represent project in workspace
 * @property {String} id - project id
 * @property {String} name - project name
 * @property {String} workspaceId - ID of the workspace to which the project belongs
 * @property {String} [image] - project image
 * @property {Number} unreadCount - project's "unreadCount" badge
 * @property {EventsListByDate} eventsListByDate - last projects event
 * @property {ProjectNotificationsRule[]} notifications - list of rules
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
 * @namespace Getters
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

  /**
   * Returns workspace by id
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Getters} getters - Vuex state
   * @return {function(String): Workspace|null}
   */
  getWorkspaceByProjectId(state, getters) {
    /**
     * Access state and getters and return the workspace
     * @param {String} projectId  - id of project in workspace
     * @return {Workspace|null}
     */
    return (projectId) => {
      const project = getters.getProjectById(projectId);

      if (!project) {
        return null;
      }

      return getters.getWorkspaceById(project.workspaceId);
    };
  },

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
   * Send request to update project settings
   * @param {function} commit - standard Vuex commit function
   * @param {Project} projectData - project params for creation
   * @return {Promise<void>}
   */
  async [UPDATE_PROJECT]({ commit }, projectData) {
    const updatedProject = await projectsApi.updateProject(projectData);

    if (updatedProject) {
      commit(mutationTypes.UPDATE_PROJECT, updatedProject);
    }
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

  /**
   * - Send request for creation new rule
   * - Add created rule to the state
   * @param {function} commit - Vuex commit for mutations
   * @param {ProjectNotificationsAddRulePayload} payload - rule form data
   * @return {Promise<void>}
   */
  async [ADD_NOTIFICATIONS_RULE]({ commit }, payload) {
    const ruleCreated = await projectsApi.addProjectNotificationsRule(payload);

    commit(mutationTypes.PUSH_NOTIFICATIONS_RULE, {
      projectId: payload.projectId,
      rule: ruleCreated,
    });
  },

  /**
   * - Send request for updating specific rule
   * - Update in the state
   * @param {function} commit - Vuex commit for mutations
   * @param {ProjectNotificationsUpdateRulePayload} payload - rule form data
   * @return {Promise<void>}
   */
  async [UPDATE_NOTIFICATIONS_RULE]({ commit }, payload) {
    const ruleUpdated = await projectsApi.updateProjectNotificationsRule(payload);

    commit(mutationTypes.UPDATE_NOTIFICATIONS_RULE, {
      projectId: payload.projectId,
      rule: ruleUpdated,
    });
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
   * Update info about a project
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Project} project - project to update
   */
  [mutationTypes.UPDATE_PROJECT](state, project) {
    const index = state.list.findIndex(element => element.id === project.id);

    state.list[index] = project;
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

  /**
   * Append new notifications rule to specified project
   * @param {ProjectsModuleState} state - Vuex state
   * @param {string} projectId - where to append
   * @param {ProjectNotificationsRule} rule - rule to append
   * @return {void}
   */
  [mutationTypes.PUSH_NOTIFICATIONS_RULE](state, { projectId, rule }) {
    const project = state.list.find(_project => _project.id === projectId);

    if (!project.notifications) {
      project.notifications = [];
    }

    project.notifications.push(rule);
  },

  /**
   * Reset updated notifications rule
   * @param {ProjectsModuleState} state - Vuex state
   * @param {string} projectId - project that contains rule
   * @param {ProjectNotificationsRule} rule - updated rule
   * @return {void}
   */
  [mutationTypes.UPDATE_NOTIFICATIONS_RULE](state, { projectId, rule }) {
    const project = state.list.find(_project => _project.id === projectId);
    const existedRuleIndex = project.notifications.findIndex(r => r.id === rule.id);

    project.notifications[existedRuleIndex] = rule;
  },
};

export default {
  state: initialState(),
  getters,
  actions,
  mutations,
};
