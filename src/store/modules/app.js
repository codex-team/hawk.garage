/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { THEME_TOGGLE } from '../actions/app';

/**
 * Module state
 * @typedef AuthModuleState
 * @type {object}
 * @property {boolean} isDark - if true dark theme is enabled
 */
const state = {
  isDark: true
};

const mutations = {
  [THEME_TOGGLE](state) {
    state.isDark = !state.isDark;
  }
};

export default {
  state,
  mutations
};
