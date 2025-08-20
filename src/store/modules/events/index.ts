import {
  FETCH_EVENT,
  FETCH_EVENT_REPETITIONS,
  FETCH_PROJECT_OVERVIEW,
  INIT_EVENTS_MODULE,
  REMOVE_EVENT_ASSIGNEE,
  SET_EVENTS_FILTERS,
  SET_EVENTS_ORDER,
  TOGGLE_EVENT_MARK,
  UPDATE_EVENT_ASSIGNEE,
  VISIT_EVENT,
  GET_CHART_DATA
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import Vue from 'vue';
import { Module } from 'vuex';
import * as eventsApi from '../../../api/events';
import { filterBeautifiedAddons } from '@/utils';
import { RootState } from '../../index';
import {
  DailyEventWithEventLinked,
  EventsFilters,
  EventsSortOrder,
  HawkEvent
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
  SetEventsList = 'SET_EVENTS_LIST',

  /**
   * Set or update event assignee
   */
  SetEventAssignee = 'SET_EVENT_ASSIGNEE',

  /**
   * Add new data to event list
   */
  AddToEventsList = 'ADD_TO_EVENTS_LIST',

  /**
   * Update event
   * Used when the event fully fetched with payload to update the state object
   * Because initial fetch request gets data without payload (title, timestamp, totalCount, visited etc.)
   * and some other data
   */
  UpdateEvent = 'UPDATE_EVENT',

  /**
   * Mark event as visited
   */
  MarkAsVisited = 'MARK_AS_VISITED',

  /**
   * Toggle mark for event
   */
  ToggleMark = 'TOGGLE_MARK',

  /**
   * Get chart data for en event for a few days
   */
  SaveChartData = 'SAVE_CHART_DATA',

  /**
   * Set project search
   */
  SetProjectSearch = 'SET_PROJECT_SEARCH',
}

/**
 * State of the Events module
 */
export interface EventsModuleState {
  /**
   * Map for storing all HawkEvents by their unique keys — (projectId:eventId)
   */
  events: EventsMap;

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
   * Search parameter map by project id
   */
  search: { [key: string]: string };
}

/**
 * Map for events storing
 */
interface EventsMap {
  [key: string]: HawkEvent;
}

/**
 * Creates and return module state
 */
function initialState(): EventsModuleState {
  return {
    events: {},
    filters: {},
    search: {},
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
        const eventEntry = Object.entries(state.events).find(([key, _event]) =>
          key.startsWith(projectId) && _event.groupHash === groupHash);

        const event = eventEntry && eventEntry[1];

        if (!event) {
          return null;
        }

        return event;
      };
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

        return state.events[key] || null;
      };
    },

    /**
     * Returns repetition by its id
     *
     * @param state - module state
     */
    getProjectEventRepetition(state: EventsModuleState) {
      /**
       * @param projectId - event's project id
       * @param repetitionId - repetition id
       */
      return (projectId: string, repetitionId: string): HawkEvent | null => {
        return state.events[getEventsListKey(projectId, repetitionId)];
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

    getProjectSearch: (state) => (projectId: string): string => {
      return state.search[projectId] || '';
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
     * @param {HawkEventsDailyInfoByProject} payload.dailyEvents - projects recent events
     */
    [INIT_EVENTS_MODULE](
      { commit }, { events }: { events: EventsMap }
    ): void {
      commit(MutationTypes.SetEventsList, events);
    },

    // @todo move to the projects actions
    async [FETCH_PROJECT_OVERVIEW]({ commit, getters }, { projectId, search, nextCursor }: { projectId: string; search: string, nextCursor: string | null }):
      Promise<{dailyEventsWithEventsLinked: DailyEventWithEventLinked[], nextCursor: string | null}> {
      const eventsSortOrder = getters.getProjectOrder(projectId);
      const dailyEventsPortion = await eventsApi.fetchDailyEventsPortion(
        projectId,
        nextCursor,
        eventsSortOrder,
        getters.getProjectFilters(projectId),
        search
      );

      if (dailyEventsPortion === null) {
        throw new Error('Error [FETCH_PROJECT_OVERVIEW]: Project not found');
      }

      const dailyEvents = dailyEventsPortion.dailyEvents;

      /**
       * Reset loadedEventsCount only when starting a new search
       * This ensures proper pagination during search
       */
      if (search.trim().length > 0 && !loadedEventsCount[projectId]) {
        loadedEventsCount[projectId] = 0;
      }

      loadedEventsCount[projectId] = (loadedEventsCount[projectId] || 0) + dailyEvents.length;

      commit(MutationTypes.AddToEventsList, {
        projectId,
        eventsList: dailyEvents.map(portion => portion.event),
      });

      const dailyEventsWithEventsLinked = dailyEvents.map(dailyEvent => {
        return {
          ...dailyEvent,
          event: undefined,
          eventId: dailyEvent.event.id,
        };
      });

      return { dailyEventsWithEventsLinked,
        nextCursor: dailyEventsPortion.nextCursor };
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
     * @returns {Promise<{ repetitions: HawkEvent[]; nextCursor?: string }>}
     */
    async [FETCH_EVENT_REPETITIONS](
      { commit },
      { projectId, eventId, originalEventId, limit, cursor }: { projectId: string; eventId: string; originalEventId: string; limit: number; cursor?: string }
    ): Promise<{ repetitions: HawkEvent[]; nextCursor?: string }> {
      const response = await eventsApi.getRepetitionsPortion(projectId, eventId, originalEventId, limit, cursor);

      const repetitions = response.data.project.event.repetitionsPortion.repetitions;
      const nextCursor = response.data.project.event.repetitionsPortion.nextCursor;

      repetitions.forEach(repetition => {
        filterBeautifiedAddons([ repetition ]);
      });

      commit(MutationTypes.AddToEventsList, {
        projectId,
        eventsList: repetitions,
      });

      return { repetitions,
        nextCursor };
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
    async [FETCH_EVENT]({ commit }, { projectId, eventId, originalEventId }): Promise<void> {
      const event = await eventsApi.getEvent(projectId, eventId, originalEventId);

      if (!event) {
        return;
      }

      commit(MutationTypes.UpdateEvent, {
        projectId,
        event,
      });
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
        commit(MutationTypes.MarkAsVisited, {
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
      const commitAction = (): void => commit(MutationTypes.ToggleMark, {
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
        commit(MutationTypes.SetEventAssignee, {
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
        commit(MutationTypes.SetEventAssignee, {
          event,
          assignee: null,
        });
      }
    },

    /**
     * Set sorting order for project
     *
     * @param {object} context - vuex action context
     * @param {Function} context.commit - VueX commit method
     * @param {Function} context.dispatch - Vuex dispatch method
     *
     * @param {object} project - object of project data
     * @param {EventsSortOrder} project.order - order to set
     * @param {string} project.projectId - project to set order for
     * @param {string} [project.search] - optional search query
     */
    async [SET_EVENTS_ORDER]({ commit, dispatch }, { projectId, order, search }) {
      commit(SET_EVENTS_ORDER, {
        projectId,
        order,
      });
      // commit(MutationTypes.ClearRecentEventsList, { projectId });

      return dispatch(FETCH_PROJECT_OVERVIEW, {
        projectId,
        search,
      });
    },

    /**
     * Set events filters
     *
     * @param {object} context - vuex action context
     * @param {Function} context.commit - VueX commit method
     * @param {Function} context.dispatch - Vuex dispatch method
     *
     * @param {object} project - object of project data
     * @param {string} project.projectId - project to set filters for
     * @param {EventsFilters} project.filters - filters to set
     * @param {string} [project.search] - optional search query
     */
    async [SET_EVENTS_FILTERS]({ commit, dispatch }, { projectId, filters, search }) {
      commit(SET_EVENTS_FILTERS, {
        projectId,
        filters,
      });

      // commit(MutationTypes.ClearRecentEventsList, { projectId });

      return dispatch(FETCH_PROJECT_OVERVIEW, {
        projectId,
        search,
      });
    },

    /**
     * Get chart data for an event for a few days
     *
     * @param {object} context - vuex action context
     * @param {Function} context.commit - VueX commit method
     * @param {Function} context.dispatch - Vuex dispatch method
     *
     * @param {object} project - object of project data
     * @param {string} project.projectId - project's id
     * @param {string} project.eventId - event's id
     * @param {number} project.days - number of a "few" days
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-vars-experimental
    async [GET_CHART_DATA]({ commit, dispatch }, { projectId, eventId, originalEventId, days }: { projectId: string; eventId: string; originalEventId: string; days: number }): Promise<void> {
      const timezoneOffset = (new Date()).getTimezoneOffset();
      const chartData = await eventsApi.fetchChartData(projectId, eventId, originalEventId, days, timezoneOffset);

      commit(MutationTypes.SaveChartData, {
        projectId,
        eventId,
        data: chartData,
      });
    },
  },
  mutations: {
    /**
     * Mutation for replacing events list
     *
     * @param {EventsModuleState} state - Vuex state
     * @param {EventsMap} eventsMap - new list of events
     */
    [MutationTypes.SetEventsList](state, eventsMap: EventsMap): void {
      Vue.set(state, 'events', eventsMap);
    },

    /**
     * Mutation for update event assignee
     *
     * @param state - state for update event assignee.
     * @param {object} payload - vuex action payload
     * @param {HawkEvent} payload.event - event for which we install assignee
     * @param {User | null} payload.assignee - user to assign to this event
     */
    [MutationTypes.SetEventAssignee](state, { event, assignee }): void {
      Vue.set(event, 'assignee', assignee);
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
    [MutationTypes.AddToEventsList](
      state,
      { projectId, eventsList }: { projectId: string; eventsList: HawkEvent[] }
    ): void {
      eventsList.forEach((event) => {
        Vue.set(state.events, getEventsListKey(projectId, event.id), event);
      });
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
    [MutationTypes.UpdateEvent](state, { projectId, event }): void {
      const key = getEventsListKey(projectId, event.id);

      if (state.events[key]) {
        const obj = Object.assign({}, state.events[key], event);

        Vue.set(state.events, key, obj);
      } else {
        Vue.set(state.events, key, event);
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
    [MutationTypes.MarkAsVisited](state, { projectId, eventId, user }): void {
      const key = getEventsListKey(projectId, eventId);

      const event = state.events[key];
      const visitedBy = new Set([...(event.visitedBy || []), user]);

      Vue.set(state.events[key], 'visitedBy', Array.from(visitedBy));
    },

    /**
     * Toggle mark for all events that have originalEventId which is equal to passed eventId
     *
     * @param {EventsModuleState} state - events module state
     *
     * @param {object} payload - vuex mutation payload
     * @param {string} payload.projectId - project event is related to
     * @param {string} payload.eventId - original event of the updated one
     * @param {EventMark} payload.mark - mark to set
     */
    [MutationTypes.ToggleMark](state, { projectId, eventId, mark }): void {
      Object.entries(state.events).forEach(([key, event]) => {
        // Only look at events for this project
        if (!key.startsWith(`${projectId}:`)) return;
    
        // Only update events whose originalEventId matches eventId
        if (event.originalEventId !== eventId) return;
    
        // Toggle the mark
        Vue.set(event.marks, mark, !event.marks[mark]);
      });
    },

    /**
     * Set sorting order for project
     *
     * @param {EventsModuleState} state - module state
     *
     * @param {object} project - object for project data
     * @param {EventsSortOrder} project.order - order to set
     * @param {string} project.projectId - project to set order for
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
     *
     * @param {object} project - object for project data
     * @param {EventsFilters} project.filters - filters object to set
     * @param {string} project.projectId - project to set filters for
     */
    [SET_EVENTS_FILTERS](state: EventsModuleState, { filters, projectId }: { filters: EventsFilters; projectId: string }): void {
      if (!state.filters[projectId]) {
        Vue.set(state.filters, projectId, {});
      }

      Vue.set(state.filters[projectId], 'filters', filters);
    },

    /**
     * Save event's chart data
     *
     * @param {EventsModuleState} state - module state
     *
     * @param {object} project - object for project data
     * @param {string} project.projectId - project ID
     * @param {string} project.eventId - event ID
     * @param {EventChartItem[]} project.data - array of dots
     */
    [MutationTypes.SaveChartData](state: EventsModuleState, { projectId, eventId, data }: { projectId: string; eventId: string; data: EventChartItem[] }): void {
      const key = getEventsListKey(projectId, eventId);
      // const event = state.events[key];

      Vue.set(state.events[key], 'chartData', data);
    },

    /**
     * Resets module state
     *
     * @param {EventsModuleState} state - Vuex state
     */
    [RESET_STORE](state: EventsModuleState): void {
      Object.assign(state, initialState());
    },

    /**
     * Set project search
     *
     * @param {EventsModuleState} state - module state
     * @param {object} payload - vuex mutation payload
     * @param {string} payload.projectId - project id
     * @param {string} payload.search - search string
     */
    [MutationTypes.SetProjectSearch](state: EventsModuleState, { projectId, search }: { projectId: string; search: string }): void {
      Vue.set(state.search, projectId, search);
    },
  },
};

export default module;
