/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { THEME_CHANGE } from '../actions/app';

/**
 * Module state
 * @typedef AppModuleState
 * @type {object}
 * @property {string} theme - name of the current theme
 */
const state = {
  theme: 'dark'
};

const mutations = {
  /**
   * Set theme name
   * @param {AppModuleState} state - app module state
   * @param {string} themeName - the name of the theme to be installed
   */
  [THEME_CHANGE](state, themeName) {
    state.theme = themeName;
  }
};

export default {
  state,
  mutations
};
