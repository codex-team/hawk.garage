/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  GET_NOTIFICATION_SETTINGS,
  UPDATE_NOTIFICATION_SETTINGS
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as projectsApi from '../../../api/projects';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_NOTIFICATION_SETTINGS: 'SET_NOTIFICATION_SETTINGS' // Set notification settings
};

/**
 * Creates module state
 */
function initialState() {
  return {
    actionType: 1,
    words: '',
    settings: {
      email: {
        enabled: false,
        value: ''
      },
      tg: {
        enabled: false,
        value: ''
      },
      slack: {
        enabled: false,
        value: ''
      }
    }
  };
}

/**
 * Module getters
 */
const getters = {};

const actions = {

  /**
   * Get notification settings
   * @param {function} commit - standard Vuex commit function
   * @param projectId - project ID
   * @returns {Promise<void>}
   */
  async [GET_NOTIFICATION_SETTINGS]({ commit }, projectId) {
    const notify = await projectsApi.notificationSettings(projectId);

    commit(mutationTypes.SET_NOTIFICATION_SETTINGS, notify);
  },

  /**
   * Update notification settings
   * @param {function} commit - standard Vuex commit function
   * @param projectId - project ID
   * @param {Notify} notify - Notify
   * @returns {Promise<void>}
   */
  async [UPDATE_NOTIFICATION_SETTINGS]({ commit }, { projectId, notify }) {
    await projectsApi.updateNotificationSettings(projectId, notify);

    commit(mutationTypes.SET_NOTIFICATION_SETTINGS, notify);
  },

  /**
   * Resets module state
   * @param {function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  }
};

const mutations = {
  /**
   * Set state by Notify
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Notify} notify - Notify settings
   */
  [mutationTypes.SET_NOTIFICATION_SETTINGS](state, notify) {
    Object.assign(state, notify);
  },

  /**
   * Resets module state
   * @param {ProjectsModuleState} state - Vuex state
   */
  [RESET_STORE](state) {
    Object.assign(state, initialState());
  }
};

export default {
  state: initialState(),
  getters,
  actions,
  mutations
};
