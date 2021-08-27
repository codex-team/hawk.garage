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
 *
 * @typedef {object} ModalDialogState
 * @property {string|null} component - name of current modal dialog component
 * @property {object} data - any data for modal dialog
 *
 * @returns {ModalDialogState}
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
   * @param {Function} dispatch - standard Vuex dispatch function
   * @param {string|null} component - name of current modal dialog component
   * @param {object} data - any data for modal dialog
   * @returns {Promise<void>}
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
   * @param {Function} dispatch - standard Vuex dispatch function
   * @returns {Promise<void>}
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
   *
   * @param {object} payload - vuex mutation payload
   * @param {string|null} payload.component - name of current modal dialog component
   * @param {object} payload.data - any data for modal dialog
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
