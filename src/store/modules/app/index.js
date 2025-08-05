import {
  FETCH_INITIAL_DATA,
  SET_LANGUAGE
} from './actionTypes';
import * as workspacesApi from '../../../api/workspaces/index.ts';
import { SET_WORKSPACES_LIST } from '../workspaces/actionTypes';
import { SET_PROJECTS_LIST } from '../projects/actionTypes';
import { INIT_EVENTS_MODULE } from '../events/actionTypes';
import { groupByGroupingTimestamp } from '../../../utils';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_THEME: 'SET_THEME', // Set theme name,
  SET_LANGUAGE: 'SET_LANGUAGE', // Set new language
};

/**
 * @enum {string} - Available themes
 */
export const Themes = {
  DARK: 'dark',
  LIGHT: 'light',
};

/**
 * @enum {string} - Available languages
 */
export const Languages = {
  en: 'en',
  ru: 'ru',
};

/**
 * Module state
 *
 * @typedef {object} AppModuleState
 * @property {Themes} theme - name of the current theme
 * @property {Languages} language - app language
 */
const state = {
  theme: Themes.DARK,
  language: Languages.en,
};

const actions = {
  /**
   * Send query request to get information about all workspaces, projects and latest project's event
   *
   * @param {Function} dispatch - standard Vuex dispatch function
   * @returns {Promise<void>}
   */
  async [FETCH_INITIAL_DATA]({ dispatch }) {
    const response = await workspacesApi.getAllWorkspacesWithProjects();

    /**
     * Response can contain errors, so we should handle only existed fields
     */
    if (!response.data || !response.data.workspaces) {
      console.error('FETCH_INITIAL_DATA: wrong response');

      return;
    }

    const workspaces = response.data.workspaces;

    dispatch(SET_WORKSPACES_LIST, workspaces);

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

    dispatch(SET_PROJECTS_LIST, projects);

    projects.forEach(project => {
      if (!project.recentEvents || !project.recentEvents.dailyInfo || !project.recentEvents.events) {
        return;
      }

      recentEvents[project.id] = groupByGroupingTimestamp(project.recentEvents.dailyInfo);
    });

    console.log('recentEvents', recentEvents);

    dispatch(INIT_EVENTS_MODULE, {
      recentEvents,
    });
  },

  /**
   * @param {Function} commit - standard Vuex dispatch function
   * @param {Languages} language - new language
   * @returns {Promise<void>}
   */
  async [SET_LANGUAGE]({ commit }, language) {
    commit(mutationTypes.SET_LANGUAGE, language);
  },
};

const mutations = {
  /**
   * Set theme name
   *
   * @param {AppModuleState} state - app module state
   * @param {Themes} themeName - the name of the theme to be installed
   */
  [mutationTypes.SET_THEME](state, themeName) {
    state.theme = themeName;
  },

  /**
   * Set app language
   *
   * @param {AppModuleState} state - app module state
   * @param {Languages} language - new language
   */
  [mutationTypes.SET_LANGUAGE](state, language) {
    state.language = language;
  },
};

export default {
  state,
  actions,
  mutations,
};
