/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  SET_EVENTS_LIST,
  FETCH_RECENT_PROJECT_EVENTS
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import Vue from 'vue';
import * as eventsApi from '../../../api/events';
import { groupBy } from '../../../utils';

const groupByDate = groupBy('date');

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_EVENTS_LIST: 'SET_EVENTS_LIST', // Set new events list
  SET_RECENT_EVENTS_LIST: 'SET_RECENT_EVENTS_LIST', // Set new recent events list
  ADD_TO_RECENT_EVENTS_LIST: 'ADD_TO_RECENT_EVENTS_LIST', // Set new recent events list
  ADD_TO_EVENTS_LIST: 'ADD_TO_EVENTS_LIST' // Set new recent events list
};

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

const eventsByGroupHash = {};

/**
 * Module getters
 */
const getters = {
  eventByGroupHash: state => groupHash => {
    if (eventsByGroupHash[groupHash]) {
      return eventsByGroupHash[groupHash];
    }

    const event = Object.values(state.list).find(_event => _event.groupHash === groupHash);

    eventsByGroupHash[groupHash] = event;
    return event;
  }
};

const actions = {
  /**
   * Sets new projects list
   * @param {function} commit - standard Vuex commit function
   * @param events
   * @param recentEvents
   * @param {[Event]} projects - new events list
   */
  [SET_EVENTS_LIST]({ commit }, { events, recentEvents }) {
    commit(mutationTypes.SET_EVENTS_LIST, events);
    commit(mutationTypes.SET_RECENT_EVENTS_LIST, recentEvents);
  },

  async [FETCH_RECENT_PROJECT_EVENTS]({ commit, state }, { projectId }) {
    const recentEvents = await eventsApi.fetchRecentProjectEvents(projectId);
    const dailyInfoByDate = groupByDate(recentEvents.dailyInfo);

    commit(mutationTypes.ADD_TO_EVENTS_LIST, { projectId, eventsList: recentEvents.events });
    commit(mutationTypes.ADD_TO_RECENT_EVENTS_LIST, { projectId, recentEventsInfoByDate: dailyInfoByDate });
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
    Vue.set(state, 'list', newList);
  },

  /**
   * Mutation for replacing events list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of events
   */
  [mutationTypes.ADD_TO_RECENT_EVENTS_LIST](state, { projectId, recentEventsInfoByDate }) {
    Object.assign(state.recent[projectId], recentEventsInfoByDate);
  },

  /**
   * Mutation for replacing events list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of events
   */
  [mutationTypes.ADD_TO_EVENTS_LIST](state, { projectId, eventsList }) {
    eventsList.forEach(event => {
      state.list[event.id] = event;
    });
  },

  /**
   * Mutation for replacing events list
   * @param {ProjectsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of events
   */
  [mutationTypes.SET_RECENT_EVENTS_LIST](state, newList) {
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
