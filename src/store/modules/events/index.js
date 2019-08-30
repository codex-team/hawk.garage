/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  SET_EVENTS_LIST
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import Vue from 'vue';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_EVENTS_LIST: 'SET_EVENTS_LIST', // Set new events list
  SET_RECENT_EVENTS_LIST: 'SET_RECENT_EVENTS_LIST' // Set new recent events list
};

/**
 * @typedef {object} Project - represent project in workspace
 * @property {String} id - project id
 * @property {String} name - project name
 * @property {String} workspaceId - ID of the workspace to which the project belongs
 * @property {String} [image] - project image
 * @property {EventsListByDate} eventsListByDate - last projects event
 */

/**
 * @typedef {Object<string, [RecentError]>} EventsListByDate
 */

/**
 * @typedef {Object} RecentError
 * @property {String} date - error date
 * @property {String} error - occurred error
 * @property {String} count - count of the errors of this type
 */

/**
 * Module state
 * @typedef {object} ProjectsModuleState
 * @property {array<Project>} list - user's projects
 */

/**
 * Creates module state
 * @return {WorkspacesModuleState}
 */
function initialState() {
  return {
    list: {}, // eventId --> eventData
    recent: {} // projectId --> [DailyEventInfo]
  };
}

/**
 * Module getters
 */
const getters = {

};

const actions = {
  /**
   * Sets new projects list
   * @param {function} commit - standard Vuex commit function
   * @param events
   * @param {[Event]} projects - new events list
   */
  [SET_EVENTS_LIST]({ commit }, {events, recentEvents}) {
    commit(mutationTypes.SET_EVENTS_LIST, events);
    commit(mutationTypes.SET_RECENT_EVENTS_LIST, recentEvents);
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
   * Mutation for replacing events list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of events
   */
  [mutationTypes.SET_EVENTS_LIST](state, newList) {
    console.log(newList)
    Vue.set(state, 'list', newList);
  },

  /**
   * Mutation for replacing events list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of events
   */
  [mutationTypes.SET_RECENT_EVENTS_LIST](state, newList) {
    console.log(newList)
    Vue.set(state, 'recent', newList);
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
