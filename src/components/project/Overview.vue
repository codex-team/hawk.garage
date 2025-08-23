<template>
  <div class="project-overview">
    <div
      v-if="project"
      v-infinite-scroll="loadMoreEvents"
      infinite-scroll-distance="300"
      class="project-overview__content"
    >
      <Chart
        :points="chartData"
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
        <template v-if="!isListEmpty">
          <div
            v-for="(eventsByDate, date) in dailyEventsGrouped"
            :key="date"
            class="project-overview__events-by-date"
          >
            <div class="project-overview__date">
              {{ getDay(date) | prettyDate }}
            </div>
            <EventItem
              v-for="(dailyEventInfo, index) in eventsByDate"
              :key="`${dailyEventInfo.groupHash}-${date}-${index}`"
              :last-occurrence-timestamp="getProjectEventById(project.id, dailyEventInfo.eventId).timestamp"
              :count="dailyEventInfo.count"
              :affected-users-count="dailyEventInfo.affectedUsers"
              class="project-overview__event"
              :event="getProjectEventById(project.id, dailyEventInfo.eventId)"
              @onAssigneeIconClick="showAssignees(project.id, dailyEventInfo.groupHash, $event)"
              @showEventOverview="
                showEventOverview(
                  project.id,
                  dailyEventInfo.eventId,
                  getProjectEventById(project.id, dailyEventInfo.eventId).originalEventId
                )
              "
            />
          </div>
          <div
            v-if="!isListEmpty && !noMoreEvents && !isLoadingEvents"
            class="project-overview__load-more"
            :class="{ loader: isLoadingEvents }"
            @click="loadMoreEvents"
          >
            <span v-if="!isLoadingEvents">{{ $t('projects.loadMoreEvents') }}</span>
          </div>
        </template>
        <div v-else-if="isLoadingEvents">
          <EventItemSkeleton />
        </div>
        <div
          v-else-if="dailyEvents.length === 0 && !isLoadingEvents"
          class="project-overview__no-events-placeholder"
        >
          <div class="project-overview__divider" />
          {{ $t('projects.noEventsPlaceholder') }}
        </div>
        <AssigneesList
          v-if="isAssigneesShowed"
          v-click-outside="hideAssigneesList"
          :style="assigneesListPosition"
          :event-group-hash="eventGroupHash"
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
import EventItem from './EventItem';
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
import EventItemSkeleton from './EventItemSkeleton';
import BlockedWorkspaceBanner from '../utils/BlockedWorkspaceBanner.vue';

/**
 * Maximum length of the search query
 */
const SEARCH_MAX_LENGTH = 50;

export default {
  name: 'ProjectOverview',
  components: {
    FiltersBar,
    EventItem,
    AssigneesList,
    Chart,
    SearchField,
    EventItemSkeleton,
    BlockedWorkspaceBanner,
  },
  data() {
    return {
      /**
       * Shows if there are no more events or there are
       */
      noMoreEvents: true,

      /**
       * Indicates whether items are loading or not.
       */
      isLoadingEvents: false,

      /**
       * Indicates whether assignees list are loading or not.
       */
      isAssigneesShowed: false,

      /**
       * Event group hash for assignees
       */
      eventGroupHash: '',

      /**
       * Data for a chart
       */
      chartData: [],

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

      const { dailyEventsWithEventsLinked, nextCursor } = await this.$store.dispatch(FETCH_PROJECT_OVERVIEW, {
        projectId: this.projectId,
        search: this.searchQuery,
        cursor: this.dailyEventsNextCursor,
      });

      this.dailyEventsNextCursor = nextCursor;
      this.noMoreEvents = this.dailyEventsNextCursor === null;

      const latestEvent = this.project.latestEvent;

      this.dailyEvents = [ ...dailyEventsWithEventsLinked ];

      /**
       * Redirect to the "add catcher" page if there are no events
       */
      if (!latestEvent) {
        await this.$router.push({
          name: 'add-catcher',
          params: { projectId: this.projectId },
        });
      }

      // How many days will be displayed in the chart
      const twoWeeks = 14;
      const boundingDays = 2;

      if (!this.$store.state.projects.charts[this.projectId]) {
        await this.$store.dispatch(FETCH_CHART_DATA, {
          projectId: this.projectId,
          days: twoWeeks + boundingDays,
        });
      }

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
     */
    async loadMoreEvents() {
      if (this.noMoreEvents) {
        return;
      }
      this.isLoadingEvents = true;
      const { nextCursor, dailyEventsWithEventsLinked } = await this.$store.dispatch(FETCH_PROJECT_OVERVIEW, {
        projectId: this.projectId,
        nextCursor: this.dailyEventsNextCursor,
        search: this.searchQuery,
      });

      this.isLoadingEvents = false;

      this.dailyEventsNextCursor = nextCursor;

      this.noMoreEvents = this.dailyEventsNextCursor === null;

      this.dailyEvents.push(...dailyEventsWithEventsLinked);
    },

    /**
     * Shows assignees list for the specific event
     *
     * @param {string} projectId - id of the current project
     * @param {string} groupHash - group hash of the event day
     * @param {GroupedEvent} event - event to display assignees list
     */
    showAssignees(projectId, groupHash, event) {
      const boundingClientRect = event.target
        .closest('.event-item__assignee')
        .getBoundingClientRect();

      this.isAssigneesShowed = true;
      this.eventGroupHash = groupHash;
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

      this.$store.commit('CLEAR_RECENT_EVENTS_LIST', { projectId: this.projectId });

      this.isLoadingEvents = true;
      try {
        const { nextCursor, dailyEventsWithEventsLinked } = await this.$store.dispatch(FETCH_PROJECT_OVERVIEW, {
          projectId: this.projectId,
          nextCursor: this.dailyEventsNextCursor,
          search: this.searchQuery,
        });

        this.dailyEventsNextCursor = nextCursor;
        this.dailyEvents = [...dailyEventsWithEventsLinked];
      } finally {
        this.isLoadingEvents = false;
      }
    },

    async reloadDailyEvents() {
      this.dailyEventsNextCursor = null;
      this.dailyEvents = [];

      this.noMoreEvents = false;

      this.loadMoreEvents();
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
