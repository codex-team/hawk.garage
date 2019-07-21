/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { SET_THEME, FETCH_INITIAL_DATA } from '../actions/app';
import * as commonApi from '../../api/common';
import { SET_WORKSPACES_LIST } from '../actions/workspaces';
import { SET_PROJECTS_LIST } from '../actions/projects';

/**
 * @enum {string} - Available themes
 */
export const Themes = {
  DARK: 'dark',
  LIGHT: 'light'
};

/**
 * Module state
 * @typedef {object} AppModuleState
 * @property {Themes} theme - name of the current theme
 */
const state = {
  theme: Themes.DARK
};

const actions = {
  /**
   * Send query request to get information about all workspaces
   * @param {function} dispatch - standard Vuex dispatch function
   * @return {Promise<void>}
   */
  async [FETCH_INITIAL_DATA]({ dispatch }) {
    const workspaces = await commonApi.getAllWorkspacesWithProjects();

    const projects = workspaces.reduce((accumulator, workspace) => {
      if (workspace.projects) {
        accumulator.push(...workspace.projects);
        delete workspace.projects;
      }
      return accumulator;
    }, []);

    dispatch(SET_WORKSPACES_LIST, workspaces);
    dispatch(SET_PROJECTS_LIST, projects);
  }
};

const mutations = {
  /**
   * Set theme name
   * @param {AppModuleState} state - app module state
   * @param {Themes} themeName - the name of the theme to be installed
   */
  [SET_THEME](state, themeName) {
    state.theme = themeName;
  }
};

export default {
  state,
  actions,
  mutations
};
