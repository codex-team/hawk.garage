import {
  SET_MODAL_DIALOG,
  RESET_MODAL_DIALOG
} from './actionTypes';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_MODAL_DIALOG: 'SET_MODAL_DIALOG_MUTATION', // Set modal dialog data,
  RESET_MODAL_DIALOG: 'RESET_MODAL_DIALOG_MUTATION', // Reset modal dialog data
};

/**
 * Module state
 * @typedef {object} ModalDialogState
 * @property {string|null} component - name of current modal dialog component
 * @property {object} data - any data for modal dialog
 */
function initialState() {
  return {
    component: null,
    data: {},
  };
}

const actions = {
  /**
   * Set current modal window data
   *
   * @param {function} dispatch - standard Vuex dispatch function
   * @property {string|null} component - name of current modal dialog component
   * @property {object} data - any data for modal dialog
   * @return {Promise<void>}
   */
  async [SET_MODAL_DIALOG]({ commit }, { component, data = {} }) {
    commit(mutationTypes.SET_MODAL_DIALOG, {
      component,
      data,
    });
  },

  /**
   * Reset modal window data
   *
   * @param {function} dispatch - standard Vuex dispatch function
   * @return {Promise<void>}
   */
  async [RESET_MODAL_DIALOG]({ commit }) {
    commit(mutationTypes.RESET_MODAL_DIALOG);
  },
};

const mutations = {
  /**
   * Set modal dialog data
   *
   * @param {ModalDialogState} state - app module state
   * @property {string|null} component - name of current modal dialog component
   * @property {object} data - any data for modal dialog
   * @param data
   */
  [mutationTypes.SET_MODAL_DIALOG](state, { component, data }) {
    state.component = component;
    state.data = data;
  },

  /**
   * Reset modal dialog data
   *
   * @param {ModalDialogState} state - app module state
   */
  [mutationTypes.RESET_MODAL_DIALOG](state) {
    state.component = null;
    state.data = {};
  },
};

export default {
  state: initialState(),
  actions,
  mutations,
};
