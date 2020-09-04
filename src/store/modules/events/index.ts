import {
  FETCH_EVENT_REPETITION,
  FETCH_EVENT_REPETITIONS,
  FETCH_RECENT_EVENTS,
  INIT_EVENTS_MODULE,
  REMOVE_EVENT_ASSIGNEE,
  SET_EVENTS_FILTERS,
  SET_EVENTS_ORDER,
  TOGGLE_EVENT_MARK,
  UPDATE_EVENT_ASSIGNEE,
  VISIT_EVENT,
  SAVE_CHART_DATA
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import Vue from 'vue';
import { Commit, Module } from 'vuex';
import * as eventsApi from '../../../api/events';
import { deepMerge, groupByGroupingTimestamp } from '@/utils';
import { RootState } from '../../index';
import {
  EventsFilters,
  EventsSortOrder,
  HawkEvent,
  HawkEventDailyInfo,
  HawkEventPayload,
  HawkEventRepetition
} from '@/types/events';
import { User } from '@/types/user';
import { EventChartItem } from '@/types/chart';

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
   * Set or update event assignee
   */
  SET_EVENT_ASSIGNEE = 'SET_EVENT_ASSIGNEE',

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
   * Update event
   * Used when the event fully fetched with payload to update the state object
   * Because initial fetch request gets data without payload (title, timestamp, totalCount, visited etc.)
   * and some other data
   */
  UPDATE_EVENT = 'UPDATE_EVENT',

  /**
   * Mark event as visited
   */
  MARK_AS_VISITED = 'MARK_AS_VISITED',

  /**
   * Toggle mark for event
   */
  TOGGLE_MARK = 'TOGGLE_MARK',

  /**
   * Clear project's recent events list
   */
  CLEAR_RECENT_EVENTS_LIST = 'CLEAR_RECENT_EVENTS_LIST',

  /**
   * Set latest events for projects to disply in projects menu
   */
  SET_LATEST_EVENTS = 'SET_LATEST_EVENTS',

  /**
   * Get chart data for en event for a few days
   */
  SAVE_CHART_DATA = 'SAVE_CHART_DATA'
}

/**
 * State of the Events module
 */
export interface EventsModuleState {
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
   * Event's filters rules map by project id
   */
  filters: {
    [key: string]: {
      filters: EventsFilters;
      order: EventsSortOrder;
    };
  };

  /**
   * Latest events map by project id
   */
  latest: {[key: string]: HawkEventDailyInfo};
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
 *
 *  @example {
 *    date:1583355600: [Object, Object],
 *    ...
 *  }
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
    repetitions: {},
    filters: {},
    latest: {},
  };
}

/**
 * Object for storing count of loaded events per project
 */
const loadedEventsCount: { [key: string]: number } = {};

/**
 * Compose events list key
 *
 * @param {string} projectId - id of the project
 * @param {string} eventId - id of event in that project
 *
 * @returns {string} key
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
   *
   * @namespace Getters
   */
  getters: {
    /**
     * Returns event by it's group hash and project id
     *
     * @param state - Vuex state
     */
    getEventByProjectIdAndGroupHash(state: EventsModuleState) {
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
     *
     * @param state - Vuex state
     */
    getRecentEventsByProjectId(state: EventsModuleState) {
      /**
       * @param {string} projectId - event's project id
       */
      return (projectId: string): HawkEventsDailyInfoByDate => state.recent[projectId];
    },

    /**
     * List state keeps only original Event
     *
     * @param state - module state
     */
    getProjectEventById(state: EventsModuleState) {
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
     *
     * @param state - module state
     */
    getProjectEventRepetition(state: EventsModuleState) {
      /**
       * @param projectId - event's project id
       * @param eventId - event id
       * @param repetitionId - id of specific repetition of the event
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
          repetition = state.repetitions[key].find(item => {
            return item.id === repetitionId;
          });
        }

        const event = Object.assign({}, state.list[key]);

        if (repetition && repetition.payload) {
          event.payload = deepMerge(event.payload, repetition.payload) as HawkEventPayload;
        }

        return event;
      };
    },

    /**
     * Returns latest recent event of the project by its id
     *
     * @param {EventsModuleState} state - Vuex state
     */
    getLatestEventDailyInfo(state) {
      /**
       * @param {string} projectId - event's project id
       */
      return (projectId: string): HawkEventDailyInfo | null => {
        return state.latest[projectId];
      };
    },

    /**
     * Returns latest event for certain project
     *
     * @param {EventsModuleState} state - Vuex state
     */
    getLatestEvent(state: EventsModuleState): ((projectId: string) => HawkEvent | null) {
      /**
       * @param {string} projectId - event's project id
       */
      return (projectId: string): HawkEvent | null => {
        const latestProjectEvent = state.latest[projectId];

        if (latestProjectEvent) {
          const lastEventGroupHash = latestProjectEvent.groupHash;

          return Object.values(state.list).find((event) => event.groupHash === lastEventGroupHash) || null;
        }

        return null;
      };
    },

    /**
     * Get filters for project
     *
     * @param {EventsModuleState} state - module state
     */
    getProjectFilters(state: EventsModuleState): (projectId: string) => EventsFilters {
      /**
       * @param {string} projectId - project to get filters for
       */
      return (projectId: string): EventsFilters => {
        return state.filters[projectId]?.filters || {};
      };
    },

    /**
     * Get events sorting order for project
     *
     * @param {EventsModuleState} state - module state
     */
    getProjectOrder(state: EventsModuleState): (projectId: string) => EventsSortOrder {
      /**
       * @param {string} projectId - project to get order for
       */
      return (projectId: string): EventsSortOrder => {
        return state.filters[projectId]?.order || EventsSortOrder.ByDate;
      };
    },
  },
  actions: {
    /**
     * Initializes the module
     *
     * @param {object} context - vuex action context
     * @param {Function} context.commit - standard Vuex commit function
     *
     * @param {object} payload - vuex action payload
     * @param {EventsMap} payload.events - events map
     * @param {HawkEventsDailyInfoByProject} payload.recentEvents - projects recent events
     */
    [INIT_EVENTS_MODULE](
      { commit }, { events, recentEvents }: { events: EventsMap; recentEvents: HawkEventsDailyInfoByProject }
    ): void {
      commit(MutationTypes.SET_EVENTS_LIST, events);
      commit(MutationTypes.SET_RECENT_EVENTS_LIST, recentEvents);
      commit(MutationTypes.SET_LATEST_EVENTS, recentEvents);
    },

    /**
     * Get latest project events
     *
     * @param {Function} commit - standard Vuex commit function
     * @param {object} getters - module getters
     * @param {string} projectId - id of the project to fetch data
     * @returns {Promise<boolean>} - true if there are no more events
     */
    async [FETCH_RECENT_EVENTS]({ commit, getters }, { projectId }: { projectId: string }): Promise<boolean> {
      const RECENT_EVENTS_FETCH_LIMIT = 15;
      const eventsSortOrder = getters.getProjectOrder(projectId);
      const recentEvents = await eventsApi.fetchRecentEvents(
        projectId,
        loadedEventsCount[projectId] || 0,
        eventsSortOrder,
        getters.getProjectFilters(projectId)
      );

      if (!recentEvents) {
        return true;
      }

      const eventsGroupedByDate = groupByGroupingTimestamp(
        recentEvents.dailyInfo,
        eventsSortOrder !== EventsSortOrder.ByCount
      );

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
     * Fetches latest repetitions
     *
     * @param {object} context - vuex action context
     * @param context.commit - to call mutations
     *
     * @param {object} payload - vuex action payload
     * @param {string} payload.projectId - id of a project that owns events
     * @param {string} payload.eventId - id of an event to fetch its repetitions
     * @param {number} payload.limit - how many items to fetch
     *
     * @returns {Promise<HawkEventRepetition[]>}
     */
    async [FETCH_EVENT_REPETITIONS](
      { commit }: { commit: Commit },
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
     * @param {object} context - vuex action context
     * @param {Function} context.commit - standard Vuex commit function
     *
     * @param {object} payload - vuex action payload
     * @param {string} payload.projectId - id of a project that owns the event
     * @param {string} payload.eventId - id of an event to fetch its repetition
     * @param {string} payload.repetitionId - id of specific repetition to fetch
     */
    async [FETCH_EVENT_REPETITION]({ commit }, { projectId, eventId, repetitionId }): Promise<void> {
      const event = await eventsApi.getEvent(projectId, eventId, repetitionId);

      if (!event) {
        return;
      }

      /**
       * Updates or sets event's fetched payload in the state
       */
      commit(MutationTypes.UPDATE_EVENT, {
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
     * @param {object} context - vuex action context
     * @param {Function} context.commit - VueX commit function
     * @param {object} context.rootState - root VueX state
     *
     * @param {object} payload - vuex action payload
     * @param {string} payload.projectId - project event is related to
     * @param {string} payload.eventId - visited event
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
     * @param {object} context - vuex action context
     * @param {Function} context.commit - vuex commit function
     *
     * @param {object} payload - vuex action payload
     * @param {string} payload.projectId - project event is related to
     * @param {string} payload.eventId - event to set mark
     * @param {EventMark} payload.mark - mark to set
     */
    async [TOGGLE_EVENT_MARK]({ commit }, { projectId, eventId, mark }): Promise<void> {
      const commitAction = (): void => commit(MutationTypes.TOGGLE_MARK, {
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
     *
     * @param {Function} commit - standard Vuex commit function
     */
    [RESET_STORE]({ commit }): void {
      commit(RESET_STORE);
    },

    /**
     * Update event assignee
     *
     * @param {object} context - vuex action context
     * @param {Function} context.commit - VueX commit function
     *
     * @param {object} payload - vuex action payload
     * @param {string} payload.projectId - project id
     * @param {string} payload.eventId - event id
     * @param {User} payload.assignee - user to assign to this event
     */
    async [UPDATE_EVENT_ASSIGNEE]({ commit }, { projectId, eventId, assignee }: { projectId: string; eventId: string; assignee: User }): Promise<void> {
      const result = await eventsApi.updateAssignee(projectId, eventId, assignee.id);
      const event: HawkEvent = this.getters.getProjectEventById(projectId, eventId);

      if (result.success) {
        commit(MutationTypes.SET_EVENT_ASSIGNEE, {
          event,
          assignee: result.record,
        });
      }
    },

    /**
     * Remove event assignee
     *
     * @param {object} context - vuex action context
     * @param {Function} context.commit - VueX commit function
     *
     * @param {object} payload - vuex action payload
     * @param {string} payload.projectId - project id
     * @param {string} payload.eventId - event id
     */
    async [REMOVE_EVENT_ASSIGNEE]({ commit }, { projectId, eventId }: { projectId: string; eventId: string }): Promise<void> {
      const result = await eventsApi.removeAssignee(projectId, eventId);
      const event: HawkEvent = this.getters.getProjectEventById(projectId, eventId);

      if (result.success) {
        commit(MutationTypes.SET_EVENT_ASSIGNEE, {
          event,
          assignee: null,
        });
      }
    },

    /**
     * Set sorting order for project
     *
     * @param {Function} commit - VueX commit method
     * @param {Function} dispatch - Vuex dispatch method
     * @param {EventsSortOrder} order - order to set
     * @param {string} projectId - project to set order for
     */
    async [SET_EVENTS_ORDER]({ commit, dispatch }, { order, projectId }: { order: EventsSortOrder; projectId: string }): Promise<void> {
      commit(SET_EVENTS_ORDER, {
        order,
        projectId,
      });

      commit(MutationTypes.CLEAR_RECENT_EVENTS_LIST, { projectId });

      dispatch(FETCH_RECENT_EVENTS, {
        projectId,
      });
    },

    /**
     * Set filters for project
     *
     * @param {Function} commit - VueX commit method
     * @param {Function} dispatch - Vuex dispatch method
     * @param {EventsFilters} filters - filters object to set
     * @param {string} projectId - projoect to set filters for
     */
    async [SET_EVENTS_FILTERS]({ commit, dispatch }, { filters, projectId }: { filters: EventsFilters; projectId: string }): Promise<void> {
      commit(SET_EVENTS_FILTERS, {
        filters,
        projectId,
      });

      commit(MutationTypes.CLEAR_RECENT_EVENTS_LIST, { projectId });

      dispatch(FETCH_RECENT_EVENTS, {
        projectId,
      });
    },

    /**
     * Get chart data for an event for a few days
     *
     * @param {Function} commit - VueX commit method
     * @param {Function} dispatch - Vuex dispatch method
     * @param {string} projectId - project's id
     * @param {string} eventId - event's id
     * @param {number} days - number of a "few" days
     */
    async [SAVE_CHART_DATA]({ commit, dispatch }, { projectId, eventId, days }: {projectId: string, eventId: string, days: number}): Promise<void> {
      const timezoneOffset = (new Date()).getTimezoneOffset();
      const chartData = await eventsApi.fetchChartData(projectId, eventId, days, timezoneOffset);

      commit(MutationTypes.SAVE_CHART_DATA, {
        projectId,
        eventId,
        data: chartData,
      });
    }
  },
  mutations: {
    /**
     * Mutation for replacing events list
     *
     * @param {EventsModuleState} state - Vuex state
     * @param {EventsMap} eventsMap - new list of events
     */
    [MutationTypes.SET_EVENTS_LIST](state, eventsMap: EventsMap): void {
      Vue.set(state, 'list', eventsMap);
    },

    /**
     * Mutation for update event assignee
     *
     * @param {object} context - vuex action context
     * @param {Function} context.commit - VueX commit function
     * @param {object} payload - vuex action payload
     * @param {HawkEvent} payload.event - event for which we install assignee
     * @param state
     * @param {User | null} payload.assignee - user to assign to this event
     */
    [MutationTypes.SET_EVENT_ASSIGNEE](state, { event, assignee }): void {
      Vue.set(event, 'assignee', assignee);
    },

    /**
     * Mutation for adding new recent events data to the store
     *
     * @param {EventsModuleState} state - Vuex state
     *
     * @param {object} payload - vuex mutation payload
     * @param payload.projectId - project that owns events
     * @param payload.recentEventsInfoByDate - grouped events list
     */
    [MutationTypes.ADD_TO_RECENT_EVENTS_LIST](
      state,
      { projectId, recentEventsInfoByDate }: { projectId: string; recentEventsInfoByDate: HawkEventsDailyInfoByDate }
    ): void {
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
     *
     * @param {EventsModuleState} state - Vuex state
     *
     * @param {object} payload - vuex mutation payload
     * @param {string} payload.projectId - id of the project to add
     * @param {Array<HawkEvent>} payload.eventsList - new list of events
     */
    [MutationTypes.ADD_TO_EVENTS_LIST](
      state,
      { projectId, eventsList }: { projectId: string; eventsList: HawkEvent[] }
    ): void {
      eventsList.forEach((event) => {
        Vue.set(state.list, getEventsListKey(projectId, event.id), event);
      });
    },

    /**
     * Mutation for replacing recent events list
     *
     * @param {EventsModuleState} state - Vuex state
     * @param {HawkEventsDailyInfoByProject} newList - new list of recent events
     */
    [MutationTypes.SET_RECENT_EVENTS_LIST](state, newList: HawkEventsDailyInfoByProject): void {
      Vue.set(state, 'recent', newList);
    },

    /**
     * Updates repetitions for event id
     *
     * @param state - event module state
     *
     * @param {object} payload - vuex mutation payload
     * @param {string} payload.projectId - id of a project that owns the event
     * @param {string} payload.eventId - id of the event
     * @param {HawkEvent} payload.repetition - repetition to save
     */
    [MutationTypes.ADD_REPETITION_PAYLOAD](state: EventsModuleState, { projectId, eventId, repetition }): void {
      const key = getEventsListKey(projectId, eventId);

      if (!state.repetitions[key]) {
        state.repetitions[key] = [];
      }

      state.repetitions[key].push(repetition);
    },

    /**
     * Updates event
     *
     * @param {EventsModuleState} state - Vuex state
     *
     * @param {object} payload - vuex mutation payload
     * @param {string} payload.projectId - project's identifier
     * @param {HawkEvent} payload.event - Event object
     */
    [MutationTypes.UPDATE_EVENT](state, { projectId, event }): void {
      const key = getEventsListKey(projectId, event.id);

      if (state.list[key]) {
        const obj = Object.assign({}, state.list[key], event);

        Vue.set(state.list, key, obj);
      } else {
        Vue.set(state.list, key, event);
      }
    },

    /**
     * Mark event as visited in state
     *
     * @param {EventsModuleState} state - events module state
     *
     * @param {object} payload - vuex mutation payload
     * @param {string} payload.projectId - project event is related to
     * @param {string} payload.eventId - visited event
     * @param {User} payload.user - user who visited event
     */
    [MutationTypes.MARK_AS_VISITED](state, { projectId, eventId, user }): void {
      const key = getEventsListKey(projectId, eventId);

      const event = state.list[key];
      const visitedBy = new Set([...(event.visitedBy || []), user]);

      Vue.set(state.list[key], 'visitedBy', Array.from(visitedBy));
    },

    /**
     * Toggle mark for passed event
     *
     * @param {EventsModuleState} state - events module state
     *
     * @param {object} payload - vuex mutation payload
     * @param {string} payload.projectId - project event is related to
     * @param {string} payload.eventId - event mark should be set to
     * @param {EventMark} payload.mark - mark to set
     */
    [MutationTypes.TOGGLE_MARK](state, { projectId, eventId, mark }): void {
      const key = getEventsListKey(projectId, eventId);

      const event = state.list[key];
      const { marks } = event;

      Vue.set(state.list[key].marks, mark, !marks[mark]);
    },

    /**
     * Set sorting order for project
     *
     * @param {EventsModuleState} state - module state
     * @param {EventsSortOrder} order - order to set
     * @param {string} projectId - project to set order for
     */
    [SET_EVENTS_ORDER](state: EventsModuleState, { order, projectId }: { order: EventsSortOrder; projectId: string }): void {
      if (!state.filters[projectId]) {
        Vue.set(state.filters, projectId, {});
      }

      Vue.set(state.filters[projectId], 'order', order);
    },

    /**
     * Set filters for project
     *
     * @param {EventsModuleState} state - module state
     * @param {EventsFilters} filters - filters object to set
     * @param {string} projectId - project to set filters for
     */
    [SET_EVENTS_FILTERS](state: EventsModuleState, { filters, projectId }: { filters: EventsFilters; projectId: string }): void {
      if (!state.filters[projectId]) {
        Vue.set(state.filters, projectId, {});
      }

      Vue.set(state.filters[projectId], 'filters', filters);
    },

    /**
     * Clear project's recent events list
     *
     * @param {EventsModuleState} state - module state
     * @param {string} projectId - project to clear
     */
    [MutationTypes.CLEAR_RECENT_EVENTS_LIST](state: EventsModuleState, { projectId }: { projectId: string }): void {
      Vue.set(state.recent, projectId, {});

      loadedEventsCount[projectId] = 0;
    },

    /**
     * Set projects' latest events
     *
     * @param {EventsModuleState} state - module state
     * @param {HawkEventsDailyInfoByProject} recentEvents - projects' recent events
     */
    [MutationTypes.SET_LATEST_EVENTS](state: EventsModuleState, recentEvents: HawkEventsDailyInfoByProject): void {
      Object
        .entries(recentEvents)
        .forEach(([projectId, eventsByTimestamp]) => {
          const eventInfo = Object.values(eventsByTimestamp)[0][0];

          Vue.set(state.latest, projectId, eventInfo);
        });
    },

    /**
     * Save event's chart data
     *
     * @param {EventsModuleState} state - module state
     * @param {string} projectId
     * @param {string} eventId
     * @param {EventChartItem[]} data - array of dots
     */
    [MutationTypes.SAVE_CHART_DATA](state: EventsModuleState, { projectId, eventId, data }: { projectId: string, eventId: string, data: EventChartItem[]}) {
      const key = getEventsListKey(projectId, eventId);
      const event = state.list[key];

      Vue.set(state.list[key], 'chartData', data);
    },

    /**
     * Resets module state
     *
     * @param {EventsModuleState} state - Vuex state
     */
    [RESET_STORE](state: EventsModuleState): void {
      Object.assign(state, initialState());
    },
  },
};

export default module;
