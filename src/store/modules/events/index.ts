import {
  FETCH_EVENT_REPETITIONS,
  FETCH_EVENT_REPETITION,
  FETCH_RECENT_EVENTS,
  FETCH_CHART_DATA,
  INIT_EVENTS_MODULE,
  VISIT_EVENT,
  TOGGLE_EVENT_MARK
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import Vue from 'vue';
import { Module } from 'vuex';
import * as eventsApi from '../../../api/events';
import { deepMerge, groupByGroupingTimestamp } from '@/utils';
import { HawkEvent, HawkEventDailyInfo, HawkEventRepetition, HawkEventPayload } from '@/types/events';
import { User } from '@/types/user';

/**
 * Root store state
 * @todo move to @/store/index.js and create interfaces for other states
 */
interface RootState {
  events: EventsModuleState;
  user: any;
}

/**
 * Mutations enum for this module
 */
enum MutationTypes {
  /**
   * Set new events list
   */
  SET_EVENTS_LIST = 'SET_EVENTS_LIST',

  /**
   * Set new recent events list
   */
  SET_RECENT_EVENTS_LIST = 'SET_RECENT_EVENTS_LIST',

  /**
   * Add new data to recent event list
   */
  ADD_TO_RECENT_EVENTS_LIST = 'ADD_TO_RECENT_EVENTS_LIST',

  /**
   * Add new data to event list
   */
  ADD_TO_EVENTS_LIST = 'ADD_TO_EVENTS_LIST',

  /**
   * Save loaded event
   */
  ADD_REPETITION_PAYLOAD = 'ADD_REPETITION_PAYLOAD',

  /**
   * Save data to be used by chart
   */
  ADD_CHART_DATA = 'ADD_CHART_DATA',

  /**
   * Update event payload
   * Used when the event fully fetched with payload to update the state object
   * Because initial fetch request gets data without payload (title, timestamp, totalCount, visited etc.)
   */
  UPDATE_EVENT_PAYLOAD = 'UPDATE_EVENT_PAYLOAD',

  /**
   * Mark event as visited
   */
  MARK_AS_VISITED = 'MARK_AS_VISITED',

  /**
   * Toggle mark for event
   */
  TOGGLE_MARK = 'TOGGLE_MARK',
}

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
  repetitions: {[key: string]: HawkEventRepetition[]};

  /**
   * Chart data for every project
   */
  charts: {[key: string]: ChartData[]};
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
 *  @example {
 *    date:1583355600: [Object, Object],
 *    ...
 *  }
 */
interface HawkEventsDailyInfoByDate {
  [key: string]: HawkEventDailyInfo[];
}

/**
 * Data for displaying one day on the chart
 */
export interface ChartData {
  timestamp: number;
  totalCount: number;
}

/**
 * Creates and return module state
 */
function initialState(): EventsModuleState {
  return {
    list: {},
    recent: {},
    repetitions: {},
    charts: {},
  };
}

/**
 * Object for storing count of loaded events per project
 */
const loadedEventsCount: { [key: string]: number } = {};

/**
 * Compose events list key
 *
 * @param {string} projectId
 * @param {string} eventId
 *
 * @return {string} key
 */
function getEventsListKey(projectId: string, eventId: string): string {
  return `${projectId}:${eventId}`;
}

/**
 * Events module
 */
const module: Module<EventsModuleState, RootState> = {
  state: initialState(),

  /**
   * All Vuex getters will be stored under this namespace
   * @namespace Getters
   */
  getters: {
    /**
     * Returns event by it's group hash and project id
     * @param {EventsModuleState} state - Vuex state
     */
    getEventByProjectIdAndGroupHash(state) {
      /**
       * @param {string} projectId - event's project id
       * @param {string} groupHash - event group hash
       */
      return (projectId: string, groupHash: string): HawkEvent | null => {
        const eventEntry = Object.entries(state.list).find(([key, _event]) =>
          key.startsWith(projectId) && _event.groupHash === groupHash);

        const event = eventEntry && eventEntry[1];

        if (!event) {
          return null;
        }

        return event;
      };
    },

    /**
     * Returns recent event of the project by its id
     * @param {EventsModuleState} state - Vuex state
     */
    getRecentEventsByProjectId(state) {
      /**
       * @param {string} projectId - event's project id
       */
      return (projectId: string): HawkEventsDailyInfoByDate => state.recent[projectId];
    },

    /**
     * List state keeps only original Event
     */
    getProjectEventById(state) {
      /**
       * @param {string} projectId - event's project id
       * @param {string} eventId - event id
       */
      return (projectId: string, eventId: string): HawkEvent | null => {
        const key = getEventsListKey(projectId, eventId);

        return state.list[key] || null;
      };
    },

    /**
     * Returns merged original event with passed repetition from stores
     */
    getProjectEventRepetition(state) {
      /**
       * @param {string} projectId - event's project id
       * @param {string} eventId - event id
       */
      return (projectId: string, eventId: string, repetitionId: string): HawkEvent | null => {
        const key = getEventsListKey(projectId, eventId);

        if (!state.repetitions[key]) {
          return state.list[key] || null;
        }

        let repetition;

        if (!repetitionId) {
          repetition = state.repetitions[key][state.repetitions[key].length - 1];
        } else {
          repetition = state.repetitions[key].find(repetition => {
            return repetition.id === repetitionId;
          });
        }

        const event = Object.assign({}, state.list[key]);

        event.payload = deepMerge(event.payload, repetition.payload);

        return event;
      };
    },

    /**
     * Returns latest recent event of the project by its id
     * @param {EventsModuleState} state - Vuex state
     */
    getLatestEventDailyInfo(state) {
      /**
       * @param {string} projectId - event's project id
       */
      return (projectId: string): HawkEventDailyInfo | null => {
        const recentProjectEvents = state.recent[projectId];

        if (recentProjectEvents) {
          const latestDailyInfo = Object.values(recentProjectEvents)[0];

          if (latestDailyInfo) {
            return latestDailyInfo[0];
          }
        }

        return null;
      };
    },

    /**
     * Returns latest event for certain project
     * @param {EventsModuleState} state - Vuex state
     * @param {Object} getters - module getters
     */
    getLatestEvent(state, getters) {
      /**
       * @param {string} projectId - event's project id
       */
      return (projectId: string): HawkEvent | null => {
        const recentProjectEvents = getters.getLatestEventDailyInfo(projectId);

        if (recentProjectEvents) {
          const lastEventGroupHash = recentProjectEvents.groupHash;

          return Object.values(state.list).find((event) => event.groupHash === lastEventGroupHash) || null;
        }

        return null;
      };
    },
  },
  actions: {
    /**
     * Initializes the module
     * @param {function} commit - standard Vuex commit function
     * @param {EventsMap} events - events map
     * @param {HawkEventsDailyInfoByProject} recentEvents - projects recent events
     */
    [INIT_EVENTS_MODULE](
      { commit }, { events, recentEvents }: { events: EventsMap; recentEvents: HawkEventsDailyInfoByProject }
    ): void {
      commit(MutationTypes.SET_EVENTS_LIST, events);
      commit(MutationTypes.SET_RECENT_EVENTS_LIST, recentEvents);
    },

    /**
     * Get latest project events
     * @param {function} commit - standard Vuex commit function
     * @param {string} projectId - id of the project to fetch data
     * @return {Promise<boolean>} - true if there are no more events
     */
    async [FETCH_RECENT_EVENTS]({ commit }, { projectId }): Promise<boolean> {
      const RECENT_EVENTS_FETCH_LIMIT = 15;
      const recentEvents = await eventsApi.fetchRecentEvents(projectId, loadedEventsCount[projectId] || 0);

      if (!recentEvents) {
        return true;
      }

      const eventsGroupedByDate = groupByGroupingTimestamp(recentEvents.dailyInfo);

      loadedEventsCount[projectId] = (loadedEventsCount[projectId] || 0) + recentEvents.dailyInfo.length;

      commit(MutationTypes.ADD_TO_EVENTS_LIST, {
        projectId,
        eventsList: recentEvents.events,
      });
      commit(MutationTypes.ADD_TO_RECENT_EVENTS_LIST, {
        projectId,
        recentEventsInfoByDate: eventsGroupedByDate,
      });

      return recentEvents.dailyInfo.length !== RECENT_EVENTS_FETCH_LIMIT;
    },

    /**
     * Get data for displaying the number of errors for each day from a specific timestamp
     * @param {function} commit - standard Vuex commit function
     * @param {string} projectId - id of the project to fetch data
     * @param {number} since - timestamp from which we start taking errors
     * @return {Promise<void>}
     */
    async [FETCH_CHART_DATA]({ commit }, { projectId, since }): Promise<void> {
      const chartData = await eventsApi.fetchChartData(projectId, since);
      const day = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const firstMidnight = new Date(since * 1000).setHours(24, 0, 0, 0);

      if (!chartData) {
        return;
      }

      /**
       * Turning it into a ChartData format
       */
      const values: Array<{groupingTimestamp: number; count: number}[]> = Object.values(groupByGroupingTimestamp(chartData));
      const groupedData: ChartData[] = values.reduce((acc: ChartData[], val: Array<{groupingTimestamp: number; count: number}>) => {
        acc.push({
          timestamp: val[0].groupingTimestamp * 1000,
          totalCount: val.reduce((sum, val) => sum + val.count, 0),
        });

        return acc;
      }, [])
        .sort((a, b) => a.timestamp - b.timestamp);

      const completedData: ChartData[] = [];

      /**
       * Inserts days that don't contain errors
       */
      for (let time = firstMidnight, index = 0; time < now; time += day) {
        // Checks whether there is a date. If not, it means that the event is not there either
        const isThereDate = index < groupedData.length && new Date(groupedData[index].timestamp).getDate() == new Date(time).getDate();

        if (isThereDate) {
          completedData.push({
            timestamp: groupedData[index].timestamp,
            totalCount: groupedData[index].totalCount,
          });

          index++;
        } else {
          completedData.push({
            timestamp: time,
            totalCount: 0,
          });
        }
      }

      commit(MutationTypes.ADD_CHART_DATA, {
        projectId,
        data: completedData,
      });
    },

    /**
     * Fetches latest repetitions
     *
     * @param {EventsModuleState} state - module state
     * @param {string} projectId
     * @param {string} eventId
     * @param {number} limit
     *
     * @return {Promise<HawkEventRepetition[]>}
     */
    async [FETCH_EVENT_REPETITIONS](
      { state, commit },
      { projectId, eventId, limit }: { projectId: string; eventId: string; limit: number }
    ): Promise<HawkEventRepetition[]> {
      const repetitions = await eventsApi.getLatestRepetitions(projectId, eventId, limit);

      repetitions.map(repetition => {
        // save to the state
        commit(MutationTypes.ADD_REPETITION_PAYLOAD, {
          projectId,
          eventId,
          repetition,
        });
      });

      return repetitions;
    },

    /**
     * Fetches original event's repetition or last repetition if repetition id was not passed
     *
     * @param {function} commit - standard Vuex commit function
     * @param {string} projectId
     * @param {string} eventId
     * @param {string} repetitionId
     */
    async [FETCH_EVENT_REPETITION]({ commit }, { projectId, eventId, repetitionId }): Promise<void> {
      const event = await eventsApi.getEvent(projectId, eventId, repetitionId);

      if (!event) {
        return;
      }

      /**
       * Updates or sets event's fetched payload in the state
       */
      commit(MutationTypes.UPDATE_EVENT_PAYLOAD, {
        projectId,
        event,
      });

      const repetition = event.repetition;

      if (repetition !== null) {
        event.payload = deepMerge(event.payload, repetition.payload) as HawkEventPayload;
        commit(MutationTypes.ADD_REPETITION_PAYLOAD, {
          projectId,
          eventId,
          repetition,
        });
      }
    },

    /**
     * Send request to mark event as visited
     *
     * @param {function} commit - VueX commit function
     * @param {object} rootState - root VueX state
     * @param {string} projectId - project event is related to
     * @param {string} eventId - visited event
     */
    async [VISIT_EVENT]({ commit, rootState }, { projectId, eventId }): Promise<void> {
      const result = await eventsApi.visitEvent(projectId, eventId);

      const user = (rootState as RootState).user.data;

      if (result) {
        commit(MutationTypes.MARK_AS_VISITED, {
          projectId,
          eventId,
          user,
        });
      }
    },

    /**
     * Send request to set mark to event
     *
     * @param {function} commit - VueX commit function
     * @param {object} rootState - VueX root state
     * @param {string} projectId - project event is related to
     * @param {string} eventId - event to set mark
     * @param {EventMark} mark - mark to set
     */
    async [TOGGLE_EVENT_MARK]({ commit, rootState }, { projectId, eventId, mark }): Promise<void> {
      const commitAction = () => commit(MutationTypes.TOGGLE_MARK, {
        projectId,
        eventId,
        mark,
      });

      /**
       * Update state before API request
       */
      commitAction();

      const result = await eventsApi.toggleEventMark(projectId, eventId, mark);

      /**
       * If API returns error, revert state
       */
      if (!result) {
        commitAction();
      }
    },

    /**
     * Resets module state
     * @param {function} commit - standard Vuex commit function
     */
    [RESET_STORE]({ commit }): void {
      commit(RESET_STORE);
    },
  },
  mutations: {
    /**
     * Mutation for replacing events list
     * @param {EventsModuleState} state - Vuex state
     * @param {EventsMap} eventsMap - new list of events
     */
    [MutationTypes.SET_EVENTS_LIST](state, eventsMap: EventsMap) {
      Vue.set(state, 'list', eventsMap);
    },

    /**
     * Mutation for adding new recent events data to the store
     * @param {EventsModuleState} state - Vuex state
     * @param {string} projectId
     * @param {HawkEventsDailyInfoByDate} recentEventsInfoByDate
     */
    [MutationTypes.ADD_TO_RECENT_EVENTS_LIST](
      state,
      { projectId, recentEventsInfoByDate }: { projectId: string; recentEventsInfoByDate: HawkEventsDailyInfoByDate }
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
     * @param {string} projectId - id of the project to add
     * @param {Array<HawkEvent>} eventsList - new list of events
     */
    [MutationTypes.ADD_TO_EVENTS_LIST](state, { projectId, eventsList }: { projectId: string; eventsList: HawkEvent[] }) {
      eventsList.forEach((event) => {
        Vue.set(state.list, getEventsListKey(projectId, event.id), event);
      });
    },

    /**
     * Mutation for replacing recent events list
     * @param {EventsModuleState} state - Vuex state
     * @param {HawkEventsDailyInfoByProject} newList - new list of recent events
     */
    [MutationTypes.SET_RECENT_EVENTS_LIST](state, newList: HawkEventsDailyInfoByProject) {
      Vue.set(state, 'recent', newList);
    },

    /**
     * Updates repetitions for event id
     *
     * @param state
     * @param {string} projectId
     * @param {string} eventId
     * @param {HawkEvent} event
     */
    [MutationTypes.ADD_REPETITION_PAYLOAD](state, { projectId, eventId, repetition }) {
      const key = getEventsListKey(projectId, eventId);

      if (!state.repetitions[key]) {
        state.repetitions[key] = [];
      }

      state.repetitions[key].push(repetition);
    },

    /**
     * Add data to store
     *
     * @param {EventsModuleState} state - Vuex state
     * @param {string} projectId - project's identifier
     * @param {chartData[]} data - data to add
     */
    [MutationTypes.ADD_CHART_DATA](state, { projectId, data }) {
      state.charts[projectId] = data;
    },

    /**
     * Updates event payload
     *
     * @param {EventsModuleState} state - Vuex state
     * @param {string} projectId - project's identifier
     * @param {HawkEvent} event - Event object
     */
    [MutationTypes.UPDATE_EVENT_PAYLOAD](state, { projectId, event }) {
      const key = getEventsListKey(projectId, event.id);

      if (state.list[key]) {
        Vue.set(state.list[key], 'payload', event.payload);
      } else {
        Vue.set(state.list, key, event);
      }
    },

    /**
     * Mark event as visited in state
     *
     * @param {EventsModuleState} state
     * @param {string} projectId - project event is related to
     * @param {string} eventId - visited event
     * @param {User} user - user who visited event
     */
    [MutationTypes.MARK_AS_VISITED](state, { projectId, eventId, user }) {
      const key = getEventsListKey(projectId, eventId);

      const event = state.list[key];
      const visitedBy = new Set([...(event.visitedBy || []), user]);

      Vue.set(state.list[key], 'visitedBy', Array.from(visitedBy));
    },

    /**
     * Toggle mark for passed event
     *
     * @param {EventsModuleState} state - events module state
     * @param {string} projectId - project event is related to
     * @param {string} eventId - event mark should be set to
     * @param {EventMark} mark - mark to set
     */
    [MutationTypes.TOGGLE_MARK](state, { projectId, eventId, mark }) {
      const key = getEventsListKey(projectId, eventId);

      const event = state.list[key];
      const { marks } = event;

      Vue.set(state.list[key].marks, mark, !marks[mark]);
    },

    /**
     * Resets module state
     * @param {EventsModuleState} state - Vuex state
     */
    [RESET_STORE](state: EventsModuleState) {
      Object.assign(state, initialState());
    },
  },
};

export default module;
