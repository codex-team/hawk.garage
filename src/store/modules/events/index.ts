import {
  FETCH_EVENT_REPETITIONS,
  FETCH_LATEST_EVENT,
  FETCH_RECENT_EVENTS,
  GET_LATEST_EVENT,
  INIT_EVENTS_MODULE
} from './actionTypes';
import {RESET_STORE} from '../../methodsTypes';
import Vue from 'vue';
import {Module} from 'vuex';
import * as eventsApi from '../../../api/events';
import {deepMerge, groupByDate} from '@/utils';
import {HawkEvent, HawkEventDailyInfo} from '@/types/events';

/**
 * Root store state
 * @todo move to @/store/index.js
 */
interface RootState {
  events: EventsModuleState;
}

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_EVENTS_LIST: 'SET_EVENTS_LIST', // Set new events list
  SET_RECENT_EVENTS_LIST: 'SET_RECENT_EVENTS_LIST', // Set new recent events list
  SET_REPETITIONS_LIST: 'SET_REPETITIONS_LIST', // something...
  ADD_TO_RECENT_EVENTS_LIST: 'ADD_TO_RECENT_EVENTS_LIST', // add new data to recent event list
  ADD_TO_EVENTS_LIST: 'ADD_TO_EVENTS_LIST', // add new data to event list
  ADD_REPETITION_PAYLOAD: 'ADD_REPETITION_PAYLOAD' // save loaded event
};

/**
 * State of the Events module
 */
interface EventsModuleState {
  /**
   * Map for storing HawkEvent by their unique key (projectId:eventId)
   */
  list: EventsMap;

  /**
   * Project's recent events grouped by date RecentInfoByDate
   */
  recent: HawkEventsDailyInfoByProject;

  /**
   * Event's repetitions map
   */
  repetitions: any;
}

/**
 * Map for events storing
 */
interface EventsMap {
  [key: string]: HawkEvent;
}

/**
 * Map for storing Event's daily info grouped by date per project
 */
interface HawkEventsDailyInfoByProject {
  [key: string]: HawkEventsDailyInfoByDate;
}

/**
 *  Map to store Event's daily info grouped by date
 */
interface HawkEventsDailyInfoByDate {
  [key: string]: HawkEventDailyInfo[];
}

/**
 * Creates and return module state
 */
function initialState(): EventsModuleState {
  return {
    list: {},
    recent: {},
    repetitions: {}
  };
}

/**
 * Object for storing count of loaded events per project
 */
const loadedEventsCount: { [key: string]: number } = {};

/**
 * Cache for storing the connection between the code and the event
 */
const eventsByGroupHash: { [key: string]: HawkEvent } = {};

/**
 * Events module
 */
const module: Module<EventsModuleState, RootState> = {
  state: initialState(),
  getters: {
    /**
     * Returns event by it's group hash and project id
     * @param {EventsModuleState} state - Vuex state
     * @return {Function}
     */
    getEventByProjectIdAndGroupHash: (state) =>
      /**
       * @param {string} projectId - event's project id
       * @param {string} groupHash - event group hash
       * @return {HawkEvent}
       */
      (projectId: string, groupHash: string): HawkEvent | null => {
        const uniqueId = projectId + ':' + groupHash;

        if (eventsByGroupHash[uniqueId]) {
          return eventsByGroupHash[uniqueId];
        }

        const event = Object.values(state.list).find((_event) => _event.groupHash === groupHash);

        if (event) {
          eventsByGroupHash[uniqueId] = event;
          return event;
        }
        return null;
      },

    /**
     * Returns recent event of the project by its id
     * @param {EventsModuleState} state - Vuex state
     */
    getRecentEventsByProjectId: (state) =>
      /**
       * @param {String} projectId - event's project id
       * @return {HawkEventsDailyInfoByProject}
       */
      (projectId: string) => state.recent[projectId],

    /**
     * List state keeps only original Event
     *
     * @return {HawkEvent}
     */
    getProjectEventById: (state) =>
      (projectId: string, eventId: string) => {
        const key = projectId + ':' + eventId;

        return state.list[key];
      },

    /**
     * Returns latest recent event of the project by its id
     * @param {EventsModuleState} state - Vuex state
     * @return {function(*): *}
     */
    getLatestEventDailyInfo: (state) =>
      /**
       * @param {String} projectId - event's project id
       * @return {HawkEventDailyInfo}
       */
      (projectId: string) => {
        const recentProjectEvents = state.recent[projectId];

        if (recentProjectEvents) {
          const latestDailyInfo = Object.values(recentProjectEvents)[0];

          if (latestDailyInfo) {
            return latestDailyInfo[0];
          }
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
       * @return {HawkEvent}
       */
      (projectId: string) => {
        const recentProjectEvents = getters.getLatestEventDailyInfo(projectId);

        if (recentProjectEvents) {
          const lastEventGroupHash = recentProjectEvents.groupHash;

          return Object.values(state.list).find((event) => event.groupHash === lastEventGroupHash);
        }
      }
  },
  actions: {
    /**
     * Initializes the module
     * @param {function} commit - standard Vuex commit function
     * @param {EventsMap} events - events map
     * @param {HawkEventsDailyInfoByProject} recentEvents - projects recent events
     */
    [INIT_EVENTS_MODULE](
      {commit}, {events, recentEvents}: { events: EventsMap, recentEvents: HawkEventsDailyInfoByProject }
    ) {
      commit(mutationTypes.SET_EVENTS_LIST, events);
      commit(mutationTypes.SET_RECENT_EVENTS_LIST, recentEvents);
    },

    /**
     * Get latest project events
     * @param {function} commit - standard Vuex commit function
     * @param {String} projectId - id of the project to fetch data
     * @return {Promise<boolean>} - true if there are no more events
     */
    async [FETCH_RECENT_EVENTS]({commit}, {projectId}) {
      const RECENT_EVENTS_FETCH_LIMIT = 15;
      const recentEvents = await eventsApi.fetchRecentEvents(projectId, loadedEventsCount[projectId] || 0);

      if (!recentEvents) {
        return true;
      }

      const dailyInfoByDate = groupByDate(recentEvents.dailyInfo);

      loadedEventsCount[projectId] = (loadedEventsCount[projectId] || 0) + recentEvents.dailyInfo.length;
      commit(mutationTypes.ADD_TO_EVENTS_LIST, {projectId, eventsList: recentEvents.events});
      commit(mutationTypes.ADD_TO_RECENT_EVENTS_LIST, {projectId, recentEventsInfoByDate: dailyInfoByDate});
      return recentEvents.dailyInfo.length !== RECENT_EVENTS_FETCH_LIMIT;
    },

    /**
     * Fetches latest repetitions
     *
     * @param commit
     * @param getters
     * @param state
     * @param {String} projectId
     * @param {String} eventId
     * @param {Number} limit
     *
     * @return {Promise<HawkEvent[]>}
     */
    async [FETCH_EVENT_REPETITIONS]({commit, getters, state}, {projectId, eventId, limit}) {
      const originalEvent = state.list[projectId + ':' + eventId];
      const repetitions = await eventsApi.getLatestRepetitions(projectId, eventId, limit);

      return repetitions.map((repetition) => {
        const newEvent = Object.assign({}, originalEvent);

        newEvent.payload = deepMerge(originalEvent.payload, repetition.payload);
        return newEvent;
      });
    },

    /**
     * Fetches original event and latest repetition
     *
     * @param commit
     * @param getters
     * @param {String} projectId
     * @param {String} eventId
     *
     * @return {HawkEvent}
     */
    async [FETCH_LATEST_EVENT]({commit, getters}, {projectId, eventId}) {
      const originalEvent = await eventsApi.getEvent(projectId, eventId);
      const repetition = await eventsApi.getLatestRepetition(projectId, eventId);
      const actualEvent = Object.assign({}, originalEvent);

      commit(mutationTypes.ADD_REPETITION_PAYLOAD, {projectId, eventId, repetition});

      if (repetition) {
        actualEvent.payload = deepMerge(actualEvent.payload, repetition.payload);
      }
      return actualEvent;
    },

    /**
     * Returns original event merged with latest repetition from store
     *
     * @param commit
     * @param state
     * @param {String} projectId
     * @param {String} eventId
     *
     * @return {HawkEvent}
     */
    async [GET_LATEST_EVENT]({commit, state}, {projectId, eventId}) {
      const key = projectId + ':' + eventId;

      const originalEvent = state.list[key];

      if (!originalEvent) {
        return this.dispatch(FETCH_LATEST_EVENT, {projectId, eventId});
      }

      const repetition = state.repetitions[key];
      const actualEvent = Object.assign({}, originalEvent);

      actualEvent.payload = deepMerge(actualEvent.payload, repetition.payload);
      return actualEvent;
    },

    /**
     * Resets module state
     * @param {function} commit - standard Vuex commit function
     */
    [RESET_STORE]({commit}) {
      commit(RESET_STORE);
    }
  },
  mutations: {
    /**
     * Mutation for replacing events list
     * @param {EventsModuleState} state - Vuex state
     * @param {EventsMap} eventsMap - new list of events
     */
    [mutationTypes.SET_EVENTS_LIST](state, eventsMap: EventsMap) {
      Vue.set(state, 'list', eventsMap);
    },

    /**
     * Mutation for adding new recent events data to the store
     * @param {EventsModuleState} state - Vuex state
     * @param {string} projectId
     * @param {HawkEventsDailyInfoByDate} recentEventsInfoByDate
     */
    [mutationTypes.ADD_TO_RECENT_EVENTS_LIST](
      state,
      {projectId, recentEventsInfoByDate}: { projectId: string, recentEventsInfoByDate: HawkEventsDailyInfoByDate }
    ) {
      /**
       * Algorithm for merging the list of recent events from vuex store and server response
       */
      Object.keys(recentEventsInfoByDate).forEach((date) => {
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
        dailyEvents.forEach((dailyEvent) => {
          const infoIndex = state.recent[projectId][date].findIndex((e) => e.groupHash === dailyEvent.groupHash);

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
     * @param {Array<HawkEvent>} eventsList - new list of events
     */
    [mutationTypes.ADD_TO_EVENTS_LIST](state, {projectId, eventsList}: { projectId: string, eventsList: HawkEvent[] }) {
      eventsList.forEach((event) => {
        state.list[projectId + ':' + event.id] = event;
      });
    },

    /**
     * Mutation for replacing recent events list
     * @param {EventsModuleState} state - Vuex state
     * @param {HawkEventsDailyInfoByProject} newList - new list of recent events
     */
    [mutationTypes.SET_RECENT_EVENTS_LIST](state, newList: HawkEventsDailyInfoByProject) {
      Vue.set(state, 'recent', newList);
    },

    /**
     * Updates list state
     *
     * @param state
     * @param {String} projectId
     * @param {String} eventId
     * @param {HawkEvent} event
     */
    [mutationTypes.ADD_REPETITION_PAYLOAD](state, {projectId, eventId, repetition}) {
      const key = projectId + ':' + eventId;

      state.repetitions[key] = repetition;
    },

    /**
     * Resets module state
     * @param {EventsModuleState} state - Vuex state
     */
    [RESET_STORE](state: EventsModuleState) {
      Object.assign(state, initialState());
    }
  }
};

export default module;
