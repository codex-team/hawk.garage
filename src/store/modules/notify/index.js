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

  async [GET_NOTIFICATION_SETTINGS]({ commit }, projectId) {
    const notify = await projectsApi.notificationSettings(projectId);

    commit(mutationTypes.SET_NOTIFICATION_SETTINGS, {
      projectId,
      notify
    });
  },

  async [UPDATE_NOTIFICATION_SETTINGS]({ commit }, { projectId, notify }) {
    const success =
      await projectsApi.updateNotificationSettings(projectId, notify);

    if (success) {
      commit(mutationTypes.SET_NOTIFICATION_SETTINGS, {
        projectId,
        notify
      });
    } else {
      return false;
    }
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
   * @param {String} projectId - id of the project to set data
   * @param {Notify} notify - Notify settings
   */
  [mutationTypes.SET_NOTIFICATION_SETTINGS](state, { projectId, notify }) {
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
