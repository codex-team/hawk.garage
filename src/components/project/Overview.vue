<template>
  <div class="project-overview">
    <div
      v-if="project"
      v-infinite-scroll="() => loadMoreEvents(false)"
      :infinite-scroll-disabled="noMoreEvents || isLoadingEvents"
      infinite-scroll-distance="300"
      class="project-overview__content"
    >
      <ProjectChart
        :project-id="projectId"
      />
      <FiltersBar
        @state-changed="reloadDailyEvents"
      />
      <!-- TODO: Add placeholder if there is no filtered events -->
      <div
        v-if="dailyEvents"
        class="project-overview__events"
      >
        <SearchField
          v-model="searchQuery"
          class="search-container"
          skin="fancy"
          :placeholder="searchFieldPlaceholder"
          :is-c-m-d-k-enabled="true"
          @input="debouncedSearch"
        />
        <BlockedWorkspaceBanner
          v-if="isWorkspaceBlocked"
          :workspace-name="workspace.name"
          :workspace-id="workspace.id"
        />
        <EventsList
          :events="dailyEvents"
          :project-id="project.id"
          :is-loading="isLoadingEvents"
          :no-more="noMoreEvents"
          :get-project-event-by-id="getProjectEventById"
          @loadMore="loadMoreEvents(false)"
          @assigneeIconClick="showAssignees($event.projectId, $event.eventId, $event.nativeEvent)"
          @showEventOverview="showEventOverview($event.projectId, $event.eventId, $event.originalEventId)"
        />
        <AssigneesList
          v-if="isAssigneesShowed"
          v-click-outside="hideAssigneesList"
          :style="assigneesListPosition"
          :event-id="assigneesEventId"
          :project-id="projectId"
          class="project-overview__assignees-list"
          @hide="hideAssigneesList"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import EventsList from './EventsList.vue';
import AssigneesList from '../event/AssigneesList';
import Chart from '../events/Chart';
import { mapGetters } from 'vuex';
import { FETCH_PROJECT_OVERVIEW } from '../../store/modules/events/actionTypes';
import {
  FETCH_CHART_DATA
} from '../../store/modules/projects/actionTypes';
import { debounce, groupByGroupingTimestamp } from '@/utils';
import FiltersBar from './FiltersBar';
import notifier from 'codex-notifier';
import NotFoundError from '@/errors/404';
import SearchField from '../forms/SearchField';
import { getPlatform } from '@/utils';
import BlockedWorkspaceBanner from '../utils/BlockedWorkspaceBanner.vue';
import ProjectChart from './ProjectChart.vue';

/**
 * Maximum length of the search query
 */
const SEARCH_MAX_LENGTH = 50;

export default {
  name: 'ProjectOverview',
  components: {
    FiltersBar,
    EventsList,
    AssigneesList,
    ProjectChart,
    SearchField,
    BlockedWorkspaceBanner,
  },
  data() {
    return {
      /**
       * Shows if there are no more events or there are
       */
      noMoreEvents: false,

      /**
       * Indicates whether items are loading or not.
       */
      isLoadingEvents: false,

      /**
       * Indicates whether assignees list are loading or not.
       */
      isAssigneesShowed: false,

      /**
       * Id of the event which assignees are showed
       */
      assigneesEventId: '',

      /**
       * Assignees list position in pixels
       */
      assigneesListPosition: {
        top: 0,
        right: 0,
      },

      /**
       * Pagination cursor for next dailyEvents portion
       */
      dailyEventsNextCursor: null,

      /**
       * Raw (not grouped by groupingTimestamp) dailyEvents list
       */
      dailyEvents: [],

      /**
       * Handler of window resize
       */
      onResize: () => {
        // do nothing
      },

      /**
       * Old window width
       */
      windowWidth: window.innerWidth,

      searchQuery: '',
    };
  },
  computed: {
    /**
     * Returns project id from the route
     *
     * @returns {string}
     */
    projectId() {
      return this.$route.params.projectId;
    },

    /**
     * Current viewed project
     *
     * @returns {Project}
     */
    project() {
      const project = this.$store.getters.getProjectById(this.projectId);

      return project;
    },

    /**
     * Current workspace
     */
    workspace() {
      if (!this.project) {
        return null;
      }

      return this.$store.getters.getWorkspaceById(this.project.workspaceId);
    },

    /**
     * Check if workspace is blocked
     */
    isWorkspaceBlocked() {
      return this.workspace?.isBlocked;
    },

    ...mapGetters([ 'getProjectEventById' ]),

    isListEmpty() {
      if (!this.dailyEvents) {
        return true;
      }

      return this.dailyEvents.length === 0;
    },

    /**
     * Daily events grouped by grouping timestamp
     * Based on data.dailyEvents
     */
    dailyEventsGrouped() {
      if (this.dailyEvents.length) {
        return groupByGroupingTimestamp(this.dailyEvents);
      }

      return {};
    },

    searchFieldPlaceholder() {
      return this.$t('forms.searchFieldWithCMDK', {
        cmd: getPlatform() === 'macos' ? '⌘' : 'Ctrl',
      });
    },
  },

  /**
   * Vue created hook
   * Used to fetch events on component creation
   */
  async created() {
    /**
     * Initialize debounced search handler
     */
    this.debouncedSearch = debounce((query) => {
      this.handleSearch(query);
    }, 500);

    try {
      if (this.project && this.project.latestEvent) {
        this.dailyEvents = [ this.project.latestEvent ];
      }

      this.loadMoreEvents(true);

      this.chartData = this.$store.state.projects.charts[this.projectId];
    } catch (error) {
      if (error instanceof NotFoundError) {
        notifier.show({
          message: this.$t('projects.notFound'),
          style: 'error',
          time: 5000,
        });

        /**
         * @todo Make 404 page and Redirect to it
         */
        this.$router.push('/');

        return;
      }

      /**
       * In case of not-404 error, throw it down
       */
      throw error;
    }
  },

  destroyed() {
    this.$store.commit('SET_PROJECT_SEARCH', {
      projectId: this.projectId,
      search: '',
    });
  },

  unmounted() {
    /** Clear search query when component is unmounted */
    this.$store.commit('SET_PROJECT_SEARCH', {
      projectId: this.projectId,
      search: '',
    });
  },

  /**
   * Clean up debounced function on component destroy
   */
  beforeDestroy() {
    this.debouncedSearch.cancel && this.debouncedSearch.cancel();
  },

  methods: {
    /**
     * Return passed day midnight timestamp
     *
     * @param {string} date - grouped day key like 'date:1576011600'
     * @returns {number}
     */
    getDay(date) {
      return parseInt(date.replace('groupingTimestamp:', ''), 10);
    },

    /**
     * Load older events to the list
     *
     * @param overwrite - determine whenever we need to overwrite this.dailyEvents
     */
    async loadMoreEvents(overwrite) {
      if (this.isLoadingEvents === true) {
        return;
      }

      if (this.noMoreEvents) {
        return;
      }

      this.isLoadingEvents = true;
      const { nextCursor, dailyEventsWithEventsLinked } = await this.$store.dispatch(FETCH_PROJECT_OVERVIEW, {
        projectId: this.projectId,
        nextCursor: this.dailyEventsNextCursor,
        search: this.searchQuery,
      });

      this.dailyEventsNextCursor = nextCursor;

      this.noMoreEvents = this.dailyEventsNextCursor === null;

      if (overwrite) {
        this.dailyEvents = [ ...dailyEventsWithEventsLinked ];
      } else {
        this.dailyEvents.push(...dailyEventsWithEventsLinked);
      }

      this.isLoadingEvents = false;
    },

    /**
     * Shows assignees list for the specific event
     *
     * @param {string} projectId - id of the current project
     * @param {string} assigneesEventId - id of the event which assignees should be showed
     * @param {GroupedEvent} event - event to display assignees list
     */
    showAssignees(projectId, assigneesEventId, event) {
      const boundingClientRect = event.target
        .closest('.event-item__assignee')
        .getBoundingClientRect();

      this.isAssigneesShowed = true;
      this.assigneesEventId = assigneesEventId;
      this.assigneesListPosition = {
        top: `${boundingClientRect.y - 3}px`,
        left: `${boundingClientRect.x}px`,
      };
      this.windowWidth = window.innerWidth;
      this.onResize = debounce(this.setAssigneesPosition, 200);

      window.addEventListener('resize', this.onResize);
    },

    /**
     * Set a new position when resizing the window
     */
    setAssigneesPosition() {
      const widthDifferent = this.windowWidth - window.innerWidth;

      this.assigneesListPosition = {
        top: this.assigneesListPosition.top,
        left: `${Number(this.assigneesListPosition.left.slice(0, -2)) - widthDifferent}px`,
      };

      this.windowWidth = window.innerWidth;
    },

    /**
     * Hide assignees popup
     */
    hideAssigneesList() {
      this.isAssigneesShowed = false;

      window.removeEventListener('resize', this.onResize);
    },

    /**
     * Opens event overview popup
     *
     * @param {string} projectId - id of the event's project
     * @param {string} eventId - id of the event to be shown
     * @param {string} originalEventId - id of the original event
     */
    showEventOverview(projectId, eventId, originalEventId) {
      this.assigneesEventId = eventId;
      if (this.isAssigneesShowed) {
        this.isAssigneesShowed = false;
      } else {
        this.$router.push({
          name: 'event-overview',
          params: {
            projectId,
            eventId: originalEventId,
            repetitionId: eventId,
          },
        });
      }
    },

    /**
     * Handle search input
     *
     * @param {string} query - search query
     */
    async handleSearch(query) {
      if (typeof query !== 'string') {
        return;
      }

      const sanitizedQuery = query.slice(0, SEARCH_MAX_LENGTH);

      this.$store.commit('SET_PROJECT_SEARCH', {
        projectId: this.projectId,
        search: sanitizedQuery,
      });

      this.noMoreEvents = false;
      this.dailyEventsNextCursor = null;

      this.loadMoreEvents(true);
    },

    async reloadDailyEvents() {
      this.dailyEventsNextCursor = null;
      this.noMoreEvents = false;

      this.loadMoreEvents(true);
    },
  },
};
</script>

<style>
@import '../../styles/custom-properties.css';

.project-overview {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  &__content {
    align-self: stretch;
    overflow-y: auto;
    @apply --hide-scrollbar;
  }

  &__events {
    display: flex;
    flex-direction: column;
    padding: 0 var(--layout-padding-inline) 15px;
  }

  &__events-by-date {
    margin-top: 25px;
  }

  &__date {
    margin-bottom: 20px;
    margin-left: 11px;
    color: var(--color-text-second);
    font-size: 14px;
  }

  &__event {
    cursor: pointer;
  }

  &__assignees-list {
    position: absolute;
    transform: translateX(-100%) translate(-15px, -5px);
  }

  &__load-more {
    height: 46px;
    margin-top: 50px;
    padding: 13px 11px 13px 15px;
    font-weight: 500;
    line-height: 20px;
    background-color: var(--color-bg-main);
    border-radius: 9px;
    cursor: pointer;
  }

  &__no-events-placeholder {
    color: var(--color-text-second);
    font-size: 14px;
    letter-spacing: 0;
  }

  &__divider {
    width: 68px;
    height: 3px;
    margin: 40px 0 20px;
    background: var(--color-text-second);
    border-radius: 2px;
  }
}

.search-container {
  margin-top: 16px;
}
</style>
