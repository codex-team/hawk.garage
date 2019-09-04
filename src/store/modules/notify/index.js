/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import Vue from 'vue';
import {
  GET_PERSONAL_NOTIFICATION_SETTINGS,
  GET_COMMON_NOTIFICATION_SETTINGS,
  UPDATE_PERSONAL_NOTIFICATION_SETTINGS,
  UPDATE_COMMON_NOTIFICATION_SETTINGS
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as projectsApi from '../../../api/projects';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_PERSONAL_NOTIFICATION_SETTINGS: 'SET_PERSONAL_NOTIFICATION_SETTINGS', // Set personal notification settings
  SET_COMMON_NOTIFICATION_SETTINGS: 'SET_COMMON_NOTIFICATION_SETTINGS' // Set common notification settings
};

/**
 * Creates module state
 */
function initialState() {
  return {
    personal: {
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
    },
    common: {
      actionType: -1,
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
    }
  };
}

/**
 * Module getters
 */
const getters = {};

const actions = {

  /**
   * Get project personal notification settings
   * @param {function} commit - standard Vuex commit function
   * @param projectId - project ID
   * @returns {Promise<void>}
   */
  async [GET_PERSONAL_NOTIFICATION_SETTINGS]({ commit }, projectId) {
    const notify = await projectsApi.personalNotificationSettings(projectId);

    commit(mutationTypes.SET_PERSONAL_NOTIFICATION_SETTINGS, notify);
  },

  /**
   * Get project common notification settings
   * @param {function} commit - standard Vuex commit function
   * @param projectId - project ID
   * @returns {Promise<void>}
   */
  async [GET_COMMON_NOTIFICATION_SETTINGS]({ commit }, projectId) {
    const notify = await projectsApi.commonNotificationSettings(projectId);

    commit(mutationTypes.SET_COMMON_NOTIFICATION_SETTINGS, notify);
  },

  /**
   * Update project personal notification settings
   * @param {function} commit - standard Vuex commit function
   * @param projectId - project ID
   * @param {Notify} notify - Notify
   * @returns {Promise<void>}
   */
  async [UPDATE_PERSONAL_NOTIFICATION_SETTINGS]({ commit }, { projectId, notify }) {
    notify = await projectsApi.updatePersonalNotificationSettings(projectId, notify);

    if (!notify) return;

    commit(mutationTypes.SET_PERSONAL_NOTIFICATION_SETTINGS, notify);
  },

  /**
   * Update project personal notification settings
   * @param {function} commit - standard Vuex commit function
   * @param projectId - project ID
   * @param {Notify} notify - Notify
   * @returns {Promise<void>}
   */
  async [UPDATE_COMMON_NOTIFICATION_SETTINGS]({ commit }, { projectId, notify }) {
    notify = await projectsApi.updateCommonNotificationSettings(projectId, notify);

    if (!notify) return;

    commit(mutationTypes.SET_COMMON_NOTIFICATION_SETTINGS, notify);
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
   * Set personal state by Notify
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Notify} notify - Notify settings
   */
  [mutationTypes.SET_PERSONAL_NOTIFICATION_SETTINGS](state, notify) {
    Vue.set(state, 'personal', notify);
  },

  /**
   * Set common state by Notify
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Notify} notify - Notify settings
   */
  [mutationTypes.SET_COMMON_NOTIFICATION_SETTINGS](state, notify) {
    Vue.set(state, 'common', notify);
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
