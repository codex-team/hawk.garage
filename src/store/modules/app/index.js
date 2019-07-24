/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { FETCH_INITIAL_DATA } from './actionTypes';
import * as workspacesApi from '../../../api/workspaces';
import { SET_WORKSPACES_LIST } from '../workspaces/actionTypes';
import { SET_PROJECTS_LIST } from '../projects/actionTypes';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_THEME: 'SET_THEME' // Set theme name
};

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
  [mutationTypes.SET_THEME](state, themeName) {
    state.theme = themeName;
  }
};

export default {
  state,
  actions,
  mutations
};
