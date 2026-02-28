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
  GET_CHART_DATA,
  GET_AFFECTED_USERS_CHART_DATA
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import type { Module } from 'vuex';
import * as eventsApi from '../../../api/events';
import { filterBeautifiedAddons } from '@/utils';
import type { RootState } from '../../index';
import type {
  DailyEventWithEventLinked,
  EventsFilters,
  HawkEvent,
  DailyEventsCursor
} from '@/types/events';
import {
  EventsSortOrder
} from '@/types/events';
import type { User } from '@/types/user';
import type { ChartLine } from '@/types/chart';

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
   * Get affected users chart data for an event for a few days
   */
  SaveAffectedUsersChartData = 'SAVE_AFFECTED_USERS_CHART_DATA',

  /**
   * Set project search
   */
  SetProjectSearch = 'SET_PROJECT_SEARCH'
}

/**
 * State of the Events module
 */
export interface EventsModuleState {
  /**
   * @todo - use Map instead of object
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
 * @param projectId - id of the project
 * @param eventId - id of event in that project
 * @returns key
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
   */
  getters: {
    /**
     * Returns event by it's group hash and project id
     * @param state - Vuex state
     */
    getEventByProjectIdAndGroupHash(state: EventsModuleState) {
      /**
       * @param projectId - event's project id
       * @param groupHash - event group hash
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
     * @param state - module state
     */
    getProjectEventById(state: EventsModuleState) {
      /**
       * @param projectId - event's project id
       * @param eventId - event id
       */
      return (projectId: string, eventId: string): HawkEvent | null => {
        const key = getEventsListKey(projectId, eventId);

        return state.events[key] || null;
      };
    },

    /**
     * Returns repetition by its id
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
     * @param state - module state
     */
    getProjectFilters(state: EventsModuleState): (projectId: string) => EventsFilters {
      /**
       * @param projectId - project to get filters for
       */
      return (projectId: string): EventsFilters => {
        return state.filters[projectId]?.filters || {};
      };
    },

    /**
     * Get events sorting order for project
     * @param state - module state
     */
    getProjectOrder(state: EventsModuleState): (projectId: string) => EventsSortOrder {
      /**
       * @param projectId - project to get order for
       */
      return (projectId: string): EventsSortOrder => {
        return state.filters[projectId]?.order || EventsSortOrder.ByDate;
      };
    },

    getProjectSearch: state => (projectId: string): string => {
      return state.search[projectId] || '';
    },
  },
  actions: {
    /**
     * Initializes the module
     * @param context - vuex action context
     * @param context.commit - standard Vuex commit function
     * @param payload - vuex action payload
     * @param payload.events - events map
     * @param payload.dailyEvents - projects recent events
     */
    [INIT_EVENTS_MODULE](
      { commit }, { events }: { events: EventsMap }
    ): void {
      commit(MutationTypes.SetEventsList, events);
    },

    /**
     * Returns nextCursor for pagination and portion of daily events with eventId pointer to the event of the state.events
     * @todo move to the projects actions
     * @param context - vuex action context
     * @param context.commit - standard Vuex commit function
     * @param payload - vuex action payload
     * @param payload.projectId - id of the project to get overview for
     * @param payload.search - event searching regex string
     * @param payload.nextCursor - pointer to the first daily event of the portion to fetch
     */
    async [FETCH_PROJECT_OVERVIEW]({ commit }, { projectId, search, nextCursor, release }: {
      projectId: string;
      search: string;
      nextCursor: DailyEventsCursor | null;
      release?: string;
    }):
      Promise<{
        dailyEventsWithEventsLinked: DailyEventWithEventLinked[];
        nextCursor: string | null;
      }> {
      const eventsSortOrder = this.getters.getProjectOrder(projectId);
      const dailyEventsPortion = await eventsApi.fetchDailyEventsPortion(
        projectId,
        nextCursor,
        eventsSortOrder,
        this.getters.getProjectFilters(projectId),
        search,
        release
      );

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

      const dailyEventsWithEventsLinked = dailyEvents.map((dailyEvent) => {
        return {
          ...dailyEvent,
          event: undefined,
          eventId: dailyEvent.event.id,
        };
      });

      return {
        dailyEventsWithEventsLinked,
        nextCursor: dailyEventsPortion.nextCursor,
      };
    },

    /**
     * Fetches latest repetitions
     * @param context - vuex action context
     * @param context.commit - to call mutations
     * @param payload - vuex action payload
     * @param payload.projectId - id of a project that owns events
     * @param payload.originalEventId - id of an original event to fetch its repetitions
     * @param payload.limit - how many items to fetch
     * @param payload.cursor - pointer to the first repetition of the portion
     * @returns
     */
    async [FETCH_EVENT_REPETITIONS](
      { commit },
      { projectId, originalEventId, limit, cursor }: {
        projectId: string;
        originalEventId: string;
        limit: number;
        cursor?: string;
      }
    ): Promise<{
      repetitions: HawkEvent[];
      nextCursor?: string;
    }> {
      const response = await eventsApi.getRepetitionsPortion(projectId, originalEventId, limit, cursor);

      let repetitions: HawkEvent[] = [];
      let nextCursor: string | undefined;

      if (response.data.project && response.data.project.event && response.data.project.event.repetitionsPortion) {
        repetitions = response.data.project.event.repetitionsPortion.repetitions;
        nextCursor = response.data.project.event.repetitionsPortion.nextCursor;
      }

      repetitions.forEach((repetition) => {
        filterBeautifiedAddons([repetition]);
      });

      commit(MutationTypes.AddToEventsList, {
        projectId,
        eventsList: repetitions,
      });

      return {
        repetitions,
        nextCursor,
      };
    },

    /**
     * Fetches original event's repetition or last repetition if repetition id was not passed
     * @param context - vuex action context
     * @param context.commit - standard Vuex commit function
     * @param payload - vuex action payload
     * @param payload.projectId - id of a project that owns the event
     * @param payload.eventId - id of an event to fetch its repetition
     * @param payload.repetitionId - id of specific repetition to fetch
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
     * @param context - vuex action context
     * @param context.commit - VueX commit function
     * @param context.rootState - root VueX state
     * @param payload - vuex action payload
     * @param payload.projectId - project event is related to
     * @param payload.originalEventId - original event of the visited one
     */
    async [VISIT_EVENT]({ commit, rootState }, { projectId, originalEventId }): Promise<void> {
      const result = await eventsApi.visitEvent(projectId, originalEventId);

      const user = (rootState).user.data;

      if (result) {
        commit(MutationTypes.MarkAsVisited, {
          projectId,
          originalEventId,
          user,
        });
      }
    },

    /**
     * Send request to set mark to event
     * @param context - vuex action context
     * @param context.commit - vuex commit function
     * @param payload - vuex action payload
     * @param payload.projectId - project event is related to
     * @param payload.eventId - event to set mark
     * @param payload.mark - mark to set
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
     * @param commit - standard Vuex commit function
     */
    [RESET_STORE]({ commit }): void {
      commit(RESET_STORE);
    },

    /**
     * Update event assignee
     * @param context - vuex action context
     * @param context.commit - VueX commit function
     * @param payload - vuex action payload
     * @param payload.projectId - project id
     * @param payload.eventId - event id
     * @param payload.assignee - user to assign to this event
     */
    async [UPDATE_EVENT_ASSIGNEE]({ commit }, { projectId, eventId, assignee }: {
      projectId: string;
      eventId: string;
      assignee: User;
    }): Promise<void> {
      const event: HawkEvent = this.getters.getProjectEventById(projectId, eventId);

      const result = await eventsApi.updateAssignee(projectId, event.originalEventId, assignee.id);

      if (result.success) {
        commit(MutationTypes.SetEventAssignee, {
          projectId,
          originalEventId: event.originalEventId,
          assignee: result.record,
        });
      }
    },

    /**
     * Remove event assignee
     * @param context - vuex action context
     * @param context.commit - VueX commit function
     * @param payload - vuex action payload
     * @param payload.projectId - project id
     * @param payload.eventId - event id
     */
    async [REMOVE_EVENT_ASSIGNEE]({ commit }, { projectId, eventId }: {
      projectId: string;
      eventId: string;
    }): Promise<void> {
      const result = await eventsApi.removeAssignee(projectId, eventId);
      const event: HawkEvent = this.getters.getProjectEventById(projectId, eventId);

      if (result.success) {
        commit(MutationTypes.SetEventAssignee, {
          projectId,
          originalEventId: event.originalEventId,
          assignee: null,
        });
      }
    },

    /**
     * Set sorting order for project
     * @param context - vuex action context
     * @param context.commit - VueX commit method
     * @param context.dispatch - Vuex dispatch method
     * @param project - object of project data
     * @param project.order - order to set
     * @param project.projectId - project to set order for
     * @param [project.search] - optional search query
     */
    async [SET_EVENTS_ORDER]({ commit, dispatch }, { projectId, order, search }) {
      commit(SET_EVENTS_ORDER, {
        projectId,
        order,
      });
    },

    /**
     * Set events filters
     * @param context - vuex action context
     * @param context.commit - VueX commit method
     * @param context.dispatch - Vuex dispatch method
     * @param project - object of project data
     * @param project.projectId - project to set filters for
     * @param project.filters - filters to set
     * @param [project.search] - optional search query
     */
    async [SET_EVENTS_FILTERS]({ commit, dispatch }, { projectId, filters, search }) {
      commit(SET_EVENTS_FILTERS, {
        projectId,
        filters,
      });
    },

    /**
     * Get chart data for an event for a specified period
     * @param context - vuex action context
     * @param context.commit - VueX commit method
     * @param context.dispatch - Vuex dispatch method
     * @param project - object of project data
     * @param project.projectId - project's id
     * @param project.eventId - event's id
     * @param project.startDate - start date
     * @param project.endDate - end date
     * @param project.groupBy - grouping interval in minutes
     */
    async [GET_CHART_DATA](
      { commit, dispatch },
      { projectId, eventId, originalEventId, days }:
        {
          projectId: string;
          eventId: string;
          originalEventId: string;
          days: number;
        }
    ): Promise<void> {
      const timezoneOffset = (new Date()).getTimezoneOffset();
      const chartData = await eventsApi.fetchChartData(
        projectId,
        originalEventId,
        days,
        timezoneOffset
      );

      commit(MutationTypes.SaveChartData, {
        projectId,
        eventId,
        data: chartData,
      });
    },

    /**
     * Get affected users chart data for an event for a specified period
     * @param context - vuex action context
     * @param context.commit - VueX commit method
     * @param payload - object of payload data
     * @param payload.projectId - project's id
     * @param payload.eventId - event's id
     * @param payload.originalEventId - original event's id
     * @param payload.days - number of days to fetch chart data for
     */
    async [GET_AFFECTED_USERS_CHART_DATA](
      { commit },
      { projectId, eventId, originalEventId, days }:
        {
          projectId: string;
          eventId: string;
          originalEventId: string;
          days: number;
        }
    ): Promise<void> {
      const timezoneOffset = (new Date()).getTimezoneOffset();
      const chartData = await eventsApi.fetchAffectedUsersChartData(
        projectId,
        originalEventId,
        days,
        timezoneOffset
      );

      commit(MutationTypes.SaveAffectedUsersChartData, {
        projectId,
        eventId,
        data: chartData,
      });
    },
  },
  mutations: {
    /**
     * Mutation for replacing events list
     * @param state - Vuex state
     * @param eventsMap - new list of events
     */
    [MutationTypes.SetEventsList](state, eventsMap: EventsMap): void {
      state.events = eventsMap;
    },

    /**
     * Mutation for update event assignee
     * @param state - state for update event assignee.
     * @param payload - vuex action payload
     * @param payload.projectId - id of the project event is related to
     * @param payload.originalEventId - original event id to match
     * @param payload.assignee - user to assign to this event
     */
    [MutationTypes.SetEventAssignee](
      state,
      { projectId, originalEventId, assignee }
    ): void {
      Object.entries(state.events).forEach(([key, currentEvent]) => {
        // Only look at events for this project
        if (!key.startsWith(`${projectId}:`)) {
          return;
        }

        // Only update events whose originalEventId matches
        if (currentEvent.originalEventId !== originalEventId) {
          return;
        }

        currentEvent.assignee = assignee;
      });
    },

    /**
     * Mutation for adding new events to the store
     * @param state - Vuex state
     * @param payload - vuex mutation payload
     * @param payload.projectId - id of the project to add
     * @param payload.eventsList - new list of events
     */
    [MutationTypes.AddToEventsList](state, { projectId, eventsList }: {
      projectId: string;
      eventsList: HawkEvent[];
    }): void {
      const additions = Object.fromEntries(eventsList.map((event) => {
        return [getEventsListKey(projectId, event.id), event];
      }));

      state.events = {
        ...state.events,
        ...additions,
      };
    },

    /**
     * Updates event
     * @param state - Vuex state
     * @param payload - vuex mutation payload
     * @param payload.projectId - project's identifier
     * @param payload.event - Event object
     */
    [MutationTypes.UpdateEvent](state, { projectId, event }): void {
      const key = getEventsListKey(projectId, event.id);

      if (state.events[key]) {
        const obj = Object.assign({}, state.events[key], event);

        state.events[key] = obj;
      } else {
        state.events[key] = event;
      }
    },

    /**
     * Mark all events (with the same originalEventId) as visited by the user
     * @param state - events module state
     * @param payload - vuex mutation payload
     * @param payload.projectId - project these events belong to
     * @param payload.originalEventId - original event id to match
     * @param payload.user - user who visited the event(s)
     */
    [MutationTypes.MarkAsVisited](state, { projectId, originalEventId, user }): void {
      Object.entries(state.events).forEach(([key, event]) => {
        // Only look at events for this project
        if (!key.startsWith(`${projectId}:`)) {
          return;
        }

        // Only update events whose originalEventId matches
        if (event.originalEventId !== originalEventId) {
          return;
        }

        // Append user once (preserve existing values)
        const visitedBy = Array.from(new Set([...(event.visitedBy || []), user]));

        event.visitedBy = visitedBy;
      });
    },

    /**
     * Toggle mark for all events that have originalEventId which is equal to passed eventId
     * @param state - events module state
     * @param payload - vuex mutation payload
     * @param payload.projectId - project event is related to
     * @param payload.eventId - original event of the updated one
     * @param payload.mark - mark to set
     */
    [MutationTypes.ToggleMark](state, { projectId, eventId, mark }): void {
      Object.entries(state.events).forEach(([key, event]) => {
        // Only look at events for this project
        if (!key.startsWith(`${projectId}:`)) {
          return;
        }

        // Only update events whose originalEventId matches eventId
        if (event.originalEventId !== eventId) {
          return;
        }

        // Toggle the mark
        event.marks[mark] = !event.marks[mark];
      });
    },

    /**
     * Set sorting order for project
     * @param state - module state
     * @param project - object for project data
     * @param project.order - order to set
     * @param project.projectId - project to set order for
     */
    [SET_EVENTS_ORDER](state: EventsModuleState, { order, projectId }: {
      order: EventsSortOrder;
      projectId: string;
    }): void {
      if (!state.filters[projectId]) {
        state.filters[projectId] = {};
      }

      state.filters[projectId].order = order;
    },

    /**
     * Set filters for project
     * @param state - module state
     * @param project - object for project data
     * @param project.filters - filters object to set
     * @param project.projectId - project to set filters for
     */
    [SET_EVENTS_FILTERS](state: EventsModuleState, { filters, projectId }: {
      filters: EventsFilters;
      projectId: string;
    }): void {
      if (!state.filters[projectId]) {
        state.filters[projectId] = {};
      }

      state.filters[projectId].filters = filters;
    },

    /**
     * Save event's chart data
     * @param state - module state
     * @param project - object for project data
     * @param project.projectId - project ID
     * @param project.eventId - event ID
     * @param project.data - array of dots
     */
    [MutationTypes.SaveChartData](state: EventsModuleState, { projectId, eventId, data }: {
      projectId: string;
      eventId: string;
      data: ChartLine[];
    }): void {
      const key = getEventsListKey(projectId, eventId);
      // const event = state.events[key];

      state.events[key].chartData = data;
    },

    /**
     * Save event's affected users chart data
     * @param state - module state
     * @param project - object for project data
     * @param project.projectId - project ID
     * @param project.eventId - event ID
     * @param project.data - array of dots
     */
    [MutationTypes.SaveAffectedUsersChartData](state: EventsModuleState, { projectId, eventId, data }: {
      projectId: string;
      eventId: string;
      data: ChartLine[];
    }): void {
      const key = getEventsListKey(projectId, eventId);

      state.events[key].affectedUsersChartData = data;
    },

    /**
     * Resets module state
     * @param state - Vuex state
     */
    [RESET_STORE](state: EventsModuleState): void {
      Object.assign(state, initialState());
    },

    /**
     * Set project search
     * @param state - module state
     * @param payload - vuex mutation payload
     * @param payload.projectId - project id
     * @param payload.search - search string
     */
    [MutationTypes.SetProjectSearch](state: EventsModuleState, { projectId, search }: {
      projectId: string;
      search: string;
    }): void {
      state.search[projectId] = search;
    },
  },
};

export default module;
