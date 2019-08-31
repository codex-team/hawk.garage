/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import {
  FETCH_INITIAL_DATA,
  SET_LANGUAGE
} from './actionTypes';
import * as workspacesApi from '../../../api/workspaces';
import { SET_WORKSPACES_LIST } from '../workspaces/actionTypes';
import { SET_PROJECTS_LIST } from '../projects/actionTypes';
import { INIT_EVENTS_MODULE } from '../events/actionTypes';
import { groupByDate } from '../../../utils';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_THEME: 'SET_THEME', // Set theme name,
  SET_LANGUAGE: 'SET_LANGUAGE' // Set new language
};

/**
 * @enum {string} - Available themes
 */
export const Themes = {
  DARK: 'dark',
  LIGHT: 'light'
};

/**
 * @enum {string} - Available languages
 */
export const Languages = {
  en: 'en',
  ru: 'ru'
};

/**
 * Module state
 * @typedef {object} AppModuleState
 * @property {Themes} theme - name of the current theme
 * @property {Languages} language - app language
 */
const state = {
  theme: Themes.DARK,
  language: Languages.en
};

const actions = {
  /**
   * Send query request to get information about all workspaces, projects and latest project's event
   * @param {function} dispatch - standard Vuex dispatch function
   * @return {Promise<void>}
   */
  async [FETCH_INITIAL_DATA]({ dispatch }) {
    const workspaces = await workspacesApi.getAllWorkspacesWithProjects();

    const projects = workspaces.reduce((accumulator, workspace) => {
      if (workspace.projects) {
        workspace.projects.forEach(project => {
          project.workspaceId = workspace.id;
        });
        accumulator.push(...workspace.projects);
        delete workspace.projects;
      }
      return accumulator;
    }, []);

    /**
     * @type {Object<string, GroupedEvent>} - all fetched events
     */
    const events = {};

    /**
     * @type {RecentInfoByDate} - latest event from all projects
     */
    const recentEvents = {};

    projects.forEach(project => {
      if (!project.recentEvents) {
        return;
      }

      recentEvents[project.id] = groupByDate(project.recentEvents.dailyInfo);

      project.recentEvents.events.forEach(event => {
        events[project.id + ':' + event.id] = event;
      });
      delete project.recentEvents;
    });

    dispatch(SET_WORKSPACES_LIST, workspaces);
    dispatch(SET_PROJECTS_LIST, projects);
    dispatch(INIT_EVENTS_MODULE, { events, recentEvents });
  },

  /**
   * @param {function} commit - standard Vuex dispatch function
   * @param {Languages} language - new language
   * @return {Promise<void>}
   */
  async [SET_LANGUAGE]({ commit }, language) {
    commit(mutationTypes.SET_LANGUAGE, language);
  }
};

const mutations = {
  /**
   * Set theme name
   * @param {AppModuleState} state - app module state
   * @param {Themes} themeName - the name of the theme to be installed
   */
  [mutationTypes.SET_THEME](state, themeName) {
    state.theme = themeName;
  },

  /**
   * Set app language
   * @param {AppModuleState} state - app module state
   * @param {Languages} language - new language
   */
  [mutationTypes.SET_LANGUAGE](state, language) {
    state.language = language;
  }
};

export default {
  state,
  actions,
  mutations
};
