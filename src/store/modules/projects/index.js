import {
  CREATE_PROJECT,
  REMOVE_PROJECTS_BY_WORKSPACE_ID,
  REMOVE_PROJECT,
  SET_PROJECTS_LIST,
  UPDATE_PROJECT_LAST_VISIT,
  UPDATE_PROJECT,
  UPDATE_PROJECT_RATE_LIMITS,
  ADD_NOTIFICATIONS_RULE,
  UPDATE_NOTIFICATIONS_RULE,
  REMOVE_NOTIFICATIONS_RULE,
  TOGGLE_NOTIFICATIONS_RULE_ENABLED_STATE,
  ADD_EVENT_GROUPING_PATTERN,
  UPDATE_EVENT_GROUPING_PATTERN,
  REMOVE_EVENT_GROUPING_PATTERN,
  FETCH_CHART_DATA,
  GENERATE_NEW_INTEGRATION_TOKEN
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as projectsApi from '../../../api/projects';

/**
 * Mutations enum for this module
 */
export const mutationTypes = {
  ADD_PROJECT: 'ADD_PROJECT', // Add new project to the projects list
  REMOVE_PROJECTS_BY_WORKSPACE_ID: 'REMOVE_PROJECTS_BY_WORKSPACE_ID', // Remove projects by workspace id from list
  UPDATE_PROJECT: 'UPDATE_PROJECT', // Set new info about a project
  UPDATE_PROJECT_PROPERTY: 'UPDATE_PROJECT_PROPERTY', // Updates project property by key
  REMOVE_PROJECT: 'REMOVE_PROJECT', // Remove project by id
  SET_PROJECTS_LIST: 'SET_PROJECTS_LIST', // Set new projects list
  SET_EVENTS_LIST_BY_DATE: 'SET_EVENTS_LIST_BY_DATE', // Set events list by date to project
  RESET_PROJECT_UNREAD_COUNT: 'SET_PROJECT_UNREAD_COUNT', // Set project unread count
  PUSH_NOTIFICATIONS_RULE: 'PUSH_NOTIFICATIONS_RULE', // append new created notify rule
  UPDATE_NOTIFICATIONS_RULE: 'UPDATE_NOTIFICATIONS_RULE', // reset updated notify rule
  REMOVE_NOTIFICATIONS_RULE: 'REMOVE_NOTIFICATIONS_RULE', // remove notify rule
  ADD_EVENT_GROUPING_PATTERN: 'ADD_EVENT_GROUPING_PATTERN',
  UPDATE_EVENT_GROUPING_PATTERN: 'UPDATE_EVENT_GROUPING_PATTERN',
  REMOVE_EVENT_GROUPING_PATTERN: 'REMOVE_EVENT_GROUPING_PATTERN',

  /**
   * Save data of events count for the last N days at the specific project
   */
  ADD_CHART_DATA: 'ADD_CHART_DATA',
};

/**
 * @typedef {object} Project - represent project in workspace
 * @property {string} id - project id
 * @property {string} name - project name
 * @property {string} workspaceId - ID of the workspace to which the project belongs
 * @property {string} [image] - project image
 * @property {number} unreadCount - project's "unreadCount" badge
 * @property {EventsListByDate} eventsListByDate - last projects event
 * @property {ProjectNotificationsRule[]} notifications - list of rules
 */

/**
 * @typedef {object<string, [RecentError]>} EventsListByDate
 */

/**
 * @typedef {object} RecentError
 * @property {string} date - error date
 * @property {string} error - occurred error
 * @property {string} count - count of the errors of this type
 */

/**
 * Module state
 *
 * @typedef {object} ProjectsModuleState
 * @property {Array<Project>} list - user's projects
 */

/**
 * Creates module state
 *
 * @returns {ProjectsModuleState}
 */
function initialState() {
  return {
    list: [],

    /**
     * Chart data for every project
     *
     * @type {object<string, ChartData[]>}
     */
    charts: {},
  };
}

/**
 * Module getters
 *
 * @namespace Getters
 */
const projectsGetters = {
  /**
   * Returns project by id
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @returns {function(string): Project}
   */
  getProjectById: state =>
    /**
     * @param {string} id project id to find
     * @returns {Project}
     */
    id => state.list.find(project => project.id === id),

  /**
   * Returns workspace by id
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Getters} getters - Vuex state
   * @returns {function(string): Workspace|null}
   */
  getWorkspaceByProjectId(state, getters) {
    /**
     * Access state and getters and return the workspace
     *
     * @param {string} projectId  - id of project in workspace
     * @returns {Workspace|null}
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
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {Project} projectData - project params for creation
   * @returns {Promise<Project>}
   */
  async [CREATE_PROJECT]({ commit }, projectData) {
    const response = await projectsApi.createProject(projectData);
    const project = response.data.project;

    project.workspaceId = projectData.workspaceId;
    commit(mutationTypes.ADD_PROJECT, project);

    return project;
  },

  /**
   * Remove projects by workspace id from list
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {string} workspaceId - workspace id
   * @returns {void}
   */
  [REMOVE_PROJECTS_BY_WORKSPACE_ID]({ commit }, workspaceId) {
    commit(mutationTypes.REMOVE_PROJECTS_BY_WORKSPACE_ID, workspaceId);
  },

  /**
   * Remove projects id from list
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {string} projectId - project id
   * @returns {Promise<void>}
   */
  async [REMOVE_PROJECT]({ commit }, projectId) {
    await projectsApi.removeProject(projectId);

    commit(mutationTypes.REMOVE_PROJECT, projectId);
  },

  /**
   * Send request to update project settings
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {Project} projectData - project params for creation
   * @returns {Promise<void>}
   */
  async [UPDATE_PROJECT]({ commit }, projectData) {
    const updatedProject = await projectsApi.updateProject(projectData);

    if (updatedProject) {
      commit(mutationTypes.UPDATE_PROJECT, updatedProject);
    }
  },

  /**
   * Send request to update project rate limits settings
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {object} payload - payload with project id and rate limit settings
   * @param {string} payload.id - project id
   * @param {ProjectRateLimitSettings} payload.rateLimitSettings - rate limit settings
   * @returns {Promise<void>}
   */
  async [UPDATE_PROJECT_RATE_LIMITS]({ commit }, { id, rateLimitSettings }) {
    const response = await projectsApi.updateProjectRateLimits(
      id,
      rateLimitSettings
    );

    if (response && response.rateLimitSettings !== undefined) {
      commit(mutationTypes.UPDATE_PROJECT_PROPERTY, {
        projectId: id,
        key: 'rateLimitSettings',
        value: response.rateLimitSettings,
      });
    }
  },

  /**
   * Send request to generate new integration token for project
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {string} projectId - project id for generation new token
   *
   * @returns {Promise<void>}
   */
  async [GENERATE_NEW_INTEGRATION_TOKEN]({ commit }, { projectId }) {
    const response = await projectsApi.generateNewIntegrationToken(projectId);

    const token = response.data.generateNewIntegrationToken.record.token;

    if (token) {
      commit(mutationTypes.UPDATE_PROJECT_PROPERTY, {
        projectId,
        key: 'token',
        value: token,
      });
    }
  },

  /**
   * Send last-visit for passed project
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - standard Vuex commit function
   *
   * @param {object} payload - vuex action payload
   * @param {string} payload.projectId - project's identifier
   * @returns {Promise<void>}
   */
  async [UPDATE_PROJECT_LAST_VISIT]({ commit }, { projectId }) {
    await projectsApi.updateLastProjectVisit(projectId);

    commit(mutationTypes.RESET_PROJECT_UNREAD_COUNT, { projectId });
  },

  /**
   * Sets new projects list
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {[Project]} projects - new projects list
   */
  [SET_PROJECTS_LIST]({ commit }, projects) {
    commit(mutationTypes.SET_PROJECTS_LIST, projects);
  },

  /**
   * Resets module state
   *
   * @param {Function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  },

  /**
   * - Send request for creation new rule
   * - Add created rule to the state
   *
   * @param {Function} commit - Vuex commit for mutations
   * @param {ProjectNotificationsAddRulePayload} payload - rule form data
   * @returns {Promise<void>}
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
   *
   * @param {Function} commit - Vuex commit for mutations
   * @param {ProjectNotificationsUpdateRulePayload} payload - rule form data
   * @returns {Promise<void>}
   */
  async [UPDATE_NOTIFICATIONS_RULE]({ commit }, payload) {
    const ruleUpdated = await projectsApi.updateProjectNotificationsRule(payload);

    commit(mutationTypes.UPDATE_NOTIFICATIONS_RULE, {
      projectId: payload.projectId,
      rule: ruleUpdated,
    });
  },

  /**
   * - Send request for removing specific rule
   * - Remove from the state
   *
   * @param {ruleId} ruleId - id of the rule to be removed
   * @param payload
   * @returns {Promise<void>}
   */
  async [REMOVE_NOTIFICATIONS_RULE]({ commit }, payload) {
    await projectsApi.removeProjectNotificationsRule(payload);

    commit(mutationTypes.REMOVE_NOTIFICATIONS_RULE, payload);
  },

  /**
   * - Send request for creation new events grouping pattern
   * - Add created pattern to the state
   *
   * @param {Function} commit - Vuex commit for mutations
   * @param {ProjectNotificationsAddRulePayload} payload - rule form data
   * @returns {Promise<void>}
   */
  async [ADD_EVENT_GROUPING_PATTERN]({ commit }, payload) {
    const response = await projectsApi.addEventGroupingPattern(payload);

    commit(mutationTypes.ADD_EVENT_GROUPING_PATTERN, { projectId: payload.projectId,
      eventGroupingPattern: response });
  },

  /**
   * - Send request for creation new rule
   * - Add created rule to the state
   *
   * @param {Function} commit - Vuex commit for mutations
   * @param {ProjectNotificationsAddRulePayload} payload - rule form data
   * @returns {Promise<void>}
   */
  async [UPDATE_EVENT_GROUPING_PATTERN]({ commit }, payload) {
    const response = await projectsApi.updateEventGroupingPattern(payload);

    commit(mutationTypes.UPDATE_EVENT_GROUPING_PATTERN, { projectId: payload.projectId,
      eventGroupingPattern: response });
  },

  /**
   * - Send request for creation new rule
   * - Add created rule to the state
   *
   * @param {Function} commit - Vuex commit for mutations
   * @param {ProjectNotificationsAddRulePayload} payload - rule form data
   * @returns {Promise<void>}
   */
  async [REMOVE_EVENT_GROUPING_PATTERN]({ commit }, payload) {
    const response = await projectsApi.removeEventGroupingPattern(payload);

    commit(mutationTypes.REMOVE_EVENT_GROUPING_PATTERN, { projectId: payload.projectId,
      eventGroupingPatternId: response.id });
  },

  /**
   * - Send request for toggle isEnabled state of the notify rule
   * - Update in the state
   *
   * @param {Function} commit - Vuex commit for mutations
   * @param {ProjectNotificationRulePointer} payload - rule form data
   * @returns {Promise<void>}
   */
  async [TOGGLE_NOTIFICATIONS_RULE_ENABLED_STATE]({ commit }, payload) {
    const ruleUpdated = await projectsApi.toggleEnabledStateOfProjectNotificationsRule(payload);

    commit(mutationTypes.UPDATE_NOTIFICATIONS_RULE, {
      projectId: payload.projectId,
      rule: ruleUpdated,
    });
  },

  /**
   * Get events counters for the last N days at the specific project
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - standard Vuex commit function
   *
   * @param {object} payload - vuex action payload
   * @param {string} payload.projectId - id of the project to fetch data
   * @param {number} payload.days - how many days we need to fetch for displaying in a chart
   * @returns {Promise<void>}
   */
  async [FETCH_CHART_DATA]({ commit }, { projectId, days }) {
    const timezoneOffset = (new Date()).getTimezoneOffset();
    const chartData = await projectsApi.fetchChartData(projectId, days, timezoneOffset);

    commit(mutationTypes.ADD_CHART_DATA, {
      projectId,
      data: chartData,
    });
  },
};

const mutations = {
  /**
   * Mutation for replacing projects list
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of projects
   */
  [mutationTypes.SET_PROJECTS_LIST](state, newList) {
    state.list = newList;
  },

  /**
   * Add project to the list
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Project} project - project to add
   */
  [mutationTypes.ADD_PROJECT](state, project) {
    state.list.push(project);
  },

  /**
   * Remove projects from list by workspace id
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @param {string} workspaceId - workspace id
   */
  [mutationTypes.REMOVE_PROJECTS_BY_WORKSPACE_ID](state, workspaceId) {
    state.list = state.list.filter(project => project.workspaceId !== workspaceId);
  },

  /**
   * Update info about a project
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Project} project - project to update
   */
  [mutationTypes.UPDATE_PROJECT](state, project) {
    const index = state.list.findIndex(element => element.id === project.id);

    if (index !== -1) {
      const existingProject = state.list[index];

      // Should merge existing project with new project to avoid losing existing data
      Vue.set(state.list, index, {
        ...existingProject,
        ...project,
      });
    }
  },

  /**
   * Updates project property by provided key and value
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @param {string} projectId - updating project id
   * @param {string} key - property in project object to update
   * @param {string | number | boolean} value - new value
   */
  [mutationTypes.UPDATE_PROJECT_PROPERTY](state, {
    projectId,
    key,
    value,
  }) {
    const project = state.list.find(_project => _project.id === projectId);

    project[key] = value;
  },

  /**
   * Remove project from list
   *
   * @param {ProjectsModuleState} state - Vuex state
   * @param {string} projectId - project id
   */
  [mutationTypes.REMOVE_PROJECT](state, projectId) {
    state.list = state.list.filter(project => project.id !== projectId);
  },

  /**
   * Store grouped events by date
   *
   * @param {ProjectsModuleState} state - Vuex state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.projectId - id of the project to set data
   * @param {EventsListByDate} payload.eventsListByDate - new event list
   */
  [mutationTypes.SET_EVENTS_LIST_BY_DATE](state, { projectId, eventsListByDate }) {
    const project = state.list.find(_project => _project.id === projectId);

    project.eventsListByDate = eventsListByDate;
  },

  /**
   * @param {ProjectsModuleState} state - Vuex state
   * @param {string} projectId - id of the project to set data
   */
  [mutationTypes.RESET_PROJECT_UNREAD_COUNT](state, { projectId }) {
    const project = state.list.find(_project => _project.id === projectId);

    /**
     * Project Id got from URL here. It can be incorrect
     */
    if (!project) {
      return;
    }

    project.unreadCount = 0;
  },

  /**
   * Resets module state
   *
   * @param {ProjectsModuleState} state - Vuex state
   */
  [RESET_STORE](state) {
    Object.assign(state, initialState());
  },

  /**
   * Append new notifications rule to specified project
   *
   * @param {ProjectsModuleState} state - Vuex state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.projectId - where to append
   * @param {ProjectNotificationsRule} payload.rule - rule to append
   * @returns {void}
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
   *
   * @param {ProjectsModuleState} state - Vuex state~
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.projectId - project that contains rule
   * @param {ProjectNotificationsRule} payload.rule - updated rule
   * @returns {void}
   */
  [mutationTypes.UPDATE_NOTIFICATIONS_RULE](state, { projectId, rule }) {
    const project = state.list.find(_project => _project.id === projectId);
    const existedRuleIndex = project.notifications.findIndex(r => r.id === rule.id);

    project.notifications[existedRuleIndex] = rule;
  },

  /**
   * Delete notifications rule from project state
   *
   * @param {ProjectsModuleState} state - Vuex state~
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.projectId - project that contains rule
   * @param {ProjectNotificationsRule} payload.rule - updated rule
   * @param payload.ruleId - id of the rule to be removed
   * @returns {void}
   */
  [mutationTypes.REMOVE_NOTIFICATIONS_RULE](state, { projectId, ruleId }) {
    const project = state.list.find(_project => _project.id === projectId);

    const existedRuleIndex = project.notifications.findIndex(r => r.id === ruleId);

    if (existedRuleIndex !== -1) {
      project.notifications.splice(existedRuleIndex, 1);
    }
  },

  /**
   * Append new event grouping pattern to specified project
   *
   * @param {ProjectsModuleState} state - Vuex state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.projectId - where to append
   * @param {ProjectNotificationsRule} payload.eventGroupingPattern - pattern to append
   * @returns {void}
   */
  [mutationTypes.ADD_EVENT_GROUPING_PATTERN](state, { projectId, eventGroupingPattern }) {
    const project = state.list.find(_project => _project.id === projectId);

    if (!project.eventGroupingPatterns) {
      project.eventGroupingPatterns = [];
    }

    project.eventGroupingPatterns.push(eventGroupingPattern);
  },

  /**
   * Reset updated notifications rule
   *
   * @param {ProjectsModuleState} state - Vuex state~
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.projectId - project that contains rule
   * @param {ProjectNotificationsRule} payload.rule - updated rule
   * @param payload.eventGroupingPattern
   * @returns {void}
   */
  [mutationTypes.UPDATE_EVENT_GROUPING_PATTERN](state, { projectId, eventGroupingPattern }) {
    const project = state.list.find(_project => _project.id === projectId);

    const existedPatternIndex = project.eventGroupingPatterns.findIndex(p => p.id === eventGroupingPattern.id);

    project.eventGroupingPatterns[existedPatternIndex] = eventGroupingPattern;
  },

  /**
   * Reset updated notifications rule
   *
   * @param {ProjectsModuleState} state - Vuex state~
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.projectId - project that contains rule
   * @param {ProjectNotificationsRule} payload.rule - updated rule
   * @param payload.eventGroupingPatternId
   * @returns {void}
   */
  [mutationTypes.REMOVE_EVENT_GROUPING_PATTERN](state, { projectId, eventGroupingPatternId }) {
    const project = state.list.find(_project => _project.id === projectId);

    const existedPatternIndex = project.eventGroupingPatterns.findIndex(p => p.id === eventGroupingPatternId);

    project.eventGroupingPatterns.splice(existedPatternIndex, 1);
  },

  /**
   * Add data to store
   *
   * @param {EventsModuleState} state - Vuex state
   * @param {object} payload - mutation payload
   * @param {string} payload.projectId - project's identifier
   * @param {chartData[]} payload.data - data to add
   */
  [mutationTypes.ADD_CHART_DATA](state, { projectId, data }) {
    state.charts[projectId] = data;
  },
};

export default {
  state: initialState(),
  getters: projectsGetters,
  actions,
  mutations,
};
