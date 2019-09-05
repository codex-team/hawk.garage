/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import { FETCH_RECENT_EVENTS, INIT_EVENTS_MODULE } from './actionTypes';
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
  ADD_TO_RECENT_EVENTS_LIST: 'ADD_TO_RECENT_EVENTS_LIST', // add new data to recent event list
  ADD_TO_EVENTS_LIST: 'ADD_TO_EVENTS_LIST' // add new data to event list
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
 * @type {Object<string, Number>} Object for storing count of loaded events per project
 */
const loadedEventsCount = {};

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
   * Returns latest recent event of the project by its id
   * @param {EventsModuleState} state - Vuex state
   * @return {function(*): *}
   */
  getLatestEventDailyInfo: state =>
    /**
     * @param {String} projectId - event's project id
     * @return {RecentInfoByDate}
     */
    projectId => {
      const recentProjectEvents = state.recent[projectId];

      if (recentProjectEvents) {
        return Object.values(recentProjectEvents)[0][0];
      }
    },

  /**
   * Returns latest event for certain project
   * @param {EventsModuleState} state - Vuex state
   * @param {Object} getters - module getters
   * @return {Function}
   */
  getLatestEvent: (state, getters) =>
    /**
     * @param {String} projectId - event's project id
     * @return {GroupedEvent}
     */
    projectId => {
      const recentProjectEvents = getters.getLatestEventDailyInfo(projectId);

      if (recentProjectEvents) {
        const lastEventGroupHash = recentProjectEvents.groupHash;

        return Object.values(state.list).find(event => event.groupHash === lastEventGroupHash);
      }
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
   * Get latest project events
   * @param {function} commit - standard Vuex commit function
   * @param {String} projectId - id of the project to fetch data
   * @return {Promise<boolean>} - true if there are no more events
   */
  async [FETCH_RECENT_EVENTS]({ commit }, { projectId }) {
    const RECENT_EVENTS_FETCH_LIMIT = 15;
    const recentEvents = await eventsApi.fetchRecentEvents(projectId, loadedEventsCount[projectId] || 0);

    if (!recentEvents) {
      return true;
    }

    const dailyInfoByDate = groupByDate(recentEvents.dailyInfo);

    loadedEventsCount[projectId] = (loadedEventsCount[projectId] || 0) + recentEvents.dailyInfo.length;
    commit(mutationTypes.ADD_TO_EVENTS_LIST, { projectId, eventsList: recentEvents.events });
    commit(mutationTypes.ADD_TO_RECENT_EVENTS_LIST, { projectId, recentEventsInfoByDate: dailyInfoByDate });
    return recentEvents.dailyInfo.length !== RECENT_EVENTS_FETCH_LIMIT;
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
    /**
     * Algorithm for merging the list of recent events from vuex store and server response
     */
    Object.keys(recentEventsInfoByDate).forEach(date => {
      /**
       * If there is no data for this date, then assign a value without merging
       */
      if (!state.recent[projectId][date]) {
        Vue.set(state.recent[projectId], date, recentEventsInfoByDate[date]);
        return;
      }
      const dailyEvents = recentEventsInfoByDate[date];

      /**
       * Merge all daily events info separately
       */
      dailyEvents.forEach(dailyEvent => {
        const infoIndex = state.recent[projectId][date].findIndex(e => e.groupHash === dailyEvent.groupHash);

        /**
         * If there is data about this event in store then update it. Else just push it to the list
         */
        if (infoIndex !== -1) {
          state.recent[projectId][date][infoIndex] = dailyEvent;
        } else {
          state.recent[projectId][date].push(dailyEvent);
        }
      });
    });
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
