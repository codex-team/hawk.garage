/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  INIT_EVENTS_MODULE,
  FETCH_PROJECT_RECENT_EVENTS,
  FETCH_EVENT_REPETITIONS,
  SAVE_EVENT
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import Vue from 'vue';
import * as eventsApi from '../../../api/events';
import { groupByDate } from '../../../utils';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_EVENTS_LIST: 'SET_EVENTS_LIST', // Set new events list
  SET_RECENT_EVENTS_LIST: 'SET_RECENT_EVENTS_LIST', // Set new recent events list
  SET_REPETITIONS_LIST: 'SET_REPETITIONS_LIST', // something...
  ADD_TO_RECENT_EVENTS_LIST: 'ADD_TO_RECENT_EVENTS_LIST', // add new data to recent event list
  ADD_TO_EVENTS_LIST: 'ADD_TO_EVENTS_LIST', // add new data to event list
  UPDATE_EVENTS_LIST: 'UPDATE_TO_LIST'
};

/**
 * @typedef {Object} RecentEvents - Event information per day with these events
 * @property {GroupedEvent[]} events - recent error list
 * @property {DailyEventInfo} dailyInfo - Information about occurred events per day
 */

/**
 * @typedef {Object} DailyEventInfo - Information about event per day
 * @property {String} groupHash - event hash for grouping
 * @property {Number} count - event occurrence count
 * @property {String} date - event occurrence date
 */

/**
 * @typedef {Object} EventsModuleState
 * @property {Object<string, GroupedEvent>} list - map for storing GroupedEvent by their unique key (projectId:eventId)
 * @property {RecentInfoByDate} recent - project's recent events grouped by date
 */

/**
 * @typedef {Object<string, Object<string, RecentEvents[]>>} RecentInfoByDate - information about recent events grouped by date
 */

/**
 * Creates module state
 * @return {EventsModuleState}
 */
function initialState() {
  return {
    list: {},
    recent: {}
  };
}

/**
 * Cache for storing the connection between the code and the event
 * @type {Object<string, GroupedEvent>}
 */
const eventsByGroupHash = {};

/**
 * Module getters
 */
const getters = {
  /**
   * Returns event by it's group hash and project id
   * @param {EventsModuleState} state - Vuex state
   * @return {Function}
   */
  getEventByProjectIdAndGroupHash: state =>
    /**
     * @param {string} projectId - event's project id
     * @param {string} groupHash - event group hash
     * @return {GroupedEvent}
     */
    (projectId, groupHash) => {
      const uniqueId = projectId + ':' + groupHash;

      if (eventsByGroupHash[uniqueId]) {
        return eventsByGroupHash[uniqueId];
      }

      const event = Object.values(state.list).find(_event => _event.groupHash === groupHash);

      eventsByGroupHash[uniqueId] = event;
      return event;
    },

  /**
   * Returns recent event of the project by its id
   * @param {EventsModuleState} state - Vuex state
   * @return {function(*): *}
   */
  getRecentEventsByProjectId: state =>
    /**
     * @param {String} projectId - event's project id
     * @return {RecentInfoByDate}
     */
    projectId => state.recent[projectId],

  /**
   * @param state
   * @return {Function}
   */
  getProjectEventById: state => (projectId, eventId) => {
    const key = projectId + ':' + eventId;

    return state.list[key];
  }
};

const actions = {
  /**
   * Initializes the module
   * @param {function} commit - standard Vuex commit function
   * @param {Object<string, GroupedEvent>} events - events list
   * @param {Object<string, RecentEvents[]>} recentEvents - projects recent events
   * @param {[Event]} projects - new events list
   */
  [INIT_EVENTS_MODULE]({ commit }, { events, recentEvents }) {
    commit(mutationTypes.SET_EVENTS_LIST, events);
    commit(mutationTypes.SET_RECENT_EVENTS_LIST, recentEvents);
  },

  /**
   * Puts single event to the events list
   * @param commit
   * @param projectId
   * @param event
   */
  [SAVE_EVENT]({ commit }, { projectId, event }) {
    commit(mutationTypes.UPDATE_EVENTS_LIST, { projectId, event });
  },

  /**
   * Get latest project events
   * @param {function} commit - standard Vuex commit function
   * @param {String} projectId - id of the project to fetch data
   * @return {Promise<void>}
   */
  async [FETCH_PROJECT_RECENT_EVENTS]({ commit }, { projectId }) {
    const recentEvents = await eventsApi.fetchRecentProjectEvents(projectId);

    if (!recentEvents) {
      return;
    }
    const dailyInfoByDate = groupByDate(recentEvents.dailyInfo);

    commit(mutationTypes.ADD_TO_EVENTS_LIST, { projectId, eventsList: recentEvents.events });
    commit(mutationTypes.ADD_TO_RECENT_EVENTS_LIST, { projectId, recentEventsInfoByDate: dailyInfoByDate });
  },

  /**
   *
   * @param commit
   * @param projectId
   * @param eventId
   * @return {Promise<void>}
   */
  async [FETCH_EVENT_REPETITIONS]({ commit }, { projectId, eventId }) {
    return eventsApi.getRepetitions(projectId, eventId);
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
   * @param {EventsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of events
   */
  [mutationTypes.SET_EVENTS_LIST](state, newList) {
    Vue.set(state, 'list', newList);
  },

  /**
   * Mutation for adding new recent events data to the store
   * @param {EventsModuleState} state - Vuex state
   * @param {Array<RecentEvents>} eventsList - new list of events
   */
  [mutationTypes.ADD_TO_RECENT_EVENTS_LIST](state, { projectId, recentEventsInfoByDate }) {
    Object.assign(state.recent[projectId], recentEventsInfoByDate); // @todo merge lists on fetching new data
  },

  /**
   * Mutation for adding new events to the store
   * @param {EventsModuleState} state - Vuex state
   * @param {String} projectId - id of the project to add
   * @param {Array<GroupedEvent>} eventsList - new list of events
   */
  [mutationTypes.ADD_TO_EVENTS_LIST](state, { projectId, eventsList }) {
    eventsList.forEach(event => {
      state.list[projectId + ':' + event.id] = event;
    });
  },

  /**
   * Mutation for replacing recent events list
   * @param {EventsModuleState} state - Vuex state
   * @param {Array<Project>} newList - new list of recent events
   */
  [mutationTypes.SET_RECENT_EVENTS_LIST](state, newList) {
    Vue.set(state, 'recent', newList);
  },

  /**
   *
   * @param state
   * @param projectId
   * @param event
   */
  [mutationTypes.UPDATE_EVENTS_LIST](state, { projectId, event }) {
    const key = projectId + ':' + event.id;

    state.list[key] = event;
  },

  /**
   * Resets module state
   * @param {EventsModuleState} state - Vuex state
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
