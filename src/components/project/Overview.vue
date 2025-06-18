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
        class="project-overview__chart"
      />
      <FiltersBar />
      <!-- TODO: Add placeholder if there is no filtered events -->
      <div
        v-if="recentEvents"
        class="project-overview__events"
      >
        <SearchField
          v-model="searchQuery"
          class="search-container"
          @input="debouncedSearch"
          skin="fancy"
          :placeholder="searchFieldPlaceholder"
          :isCMDKEnabled="true"
        />
        <div v-if="isWorkspaceBlocked" class="project-overview__blocked-banner">
          <div v-html="blockedBannerText" class="project-overview__blocked-banner-header"></div>
          <div>{{ $t('workspaces.blocked.description') }}</div>
          <UiButton
            :content="$t('workspaces.blocked.incrementLimit')"
            class="project-overview__blocked-banner-button"
            submit
            @click="incrementEventsLimit"
          />
        </div>
        <template v-if="!isListEmpty">
          <div
            v-for="(eventsByDate, date) in recentEvents"
            :key="date"
            class="project-overview__events-by-date"
          >
            <div class="project-overview__date">
              {{ getDay(date) | prettyDate }}
            </div>
            <EventItem
              v-for="(dailyEventInfo, index) in eventsByDate"
              :key="`${dailyEventInfo.groupHash}-${date}-${index}`"
              :last-occurrence-timestamp="dailyEventInfo.lastRepetitionTime"
              :count="dailyEventInfo.count"
              :affected-users-count="dailyEventInfo.affectedUsers"
              class="project-overview__event"
              :event="getEventByProjectIdAndGroupHash(project.id, dailyEventInfo.groupHash)"
              @onAssigneeIconClick="showAssignees(project.id, dailyEventInfo.groupHash, $event)"
              @showEventOverview="showEventOverview(project.id, dailyEventInfo.groupHash, dailyEventInfo.lastRepetitionId)"
            />
          </div>
          <div
            v-if="!isListEmpty && !noMoreEvents && !isLoadingEvents"
            class="project-overview__load-more"
            :class="{'loader': isLoadingEvents}"
            @click="loadMoreEvents"
          >
            <span v-if="!isLoadingEvents">{{ $t('projects.loadMoreEvents') }}</span>
          </div>
        </template>
        <div v-else-if="isLoadingEvents">
          <EventItemSkeleton />
        </div>
        <div
          v-else-if="Object.keys(recentEvents).length === 0 && !isLoadingEvents"
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
import { FETCH_RECENT_EVENTS } from '../../store/modules/events/actionTypes';
import { UPDATE_PROJECT_LAST_VISIT, FETCH_CHART_DATA } from '../../store/modules/projects/actionTypes';
import { debounce } from '@/utils';
import FiltersBar from './FiltersBar';
import notifier from 'codex-notifier';
import NotFoundError from '@/errors/404';
import SearchField from '../forms/SearchField';
import { getPlatform } from '@/utils';
import EventItemSkeleton from './EventItemSkeleton';
import UiButton from '../utils/UiButton.vue';
import { SET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';
import { FETCH_PLANS } from '../../store/modules/plans/actionTypes';

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
    UiButton,
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
      return this.$store.getters.getProjectById(this.projectId);
    },

    /**
     * Current workspace
     */
     workspace() {
      if (!this.project) return null;
      return this.$store.getters.getWorkspaceById(this.project.workspaceId);
    },

    /**
     * Check if workspace is blocked
     */
    isWorkspaceBlocked() {
      return this.workspace?.isBlocked;
    },

    /**
     * Text for the blocked banner
     */
    blockedBannerText() {
      return this.$t('workspaces.blocked.banner', { workspaceName: this.workspace?.name });
    },

    /**
     * Project recent errors
     *
     * @returns {RecentInfoByDate}
     */
    recentEvents() {
      if (!this.project) {
        return null;
      }

      return this.$store.getters.getRecentEventsByProjectId(this.projectId);
    },

    ...mapGetters([ 'getEventByProjectIdAndGroupHash' ]),

    isListEmpty() {
      if (!this.recentEvents) {
        return true;
      }

      return Object.keys(this.recentEvents).length === 0;
    },

    searchFieldPlaceholder() {
      return this.$t('forms.searchFieldWithCMDK', { cmd: getPlatform() === 'macos' ? '⌘' : 'Ctrl' });
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
      this.noMoreEvents = await this.$store.dispatch(FETCH_RECENT_EVENTS, { projectId: this.projectId,
        search: this.searchQuery  });

      const latestEvent = this.$store.getters.getLatestEvent(this.projectId);

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
      this.noMoreEvents = await this.$store.dispatch(FETCH_RECENT_EVENTS, {
        projectId: this.projectId,
        search: this.searchQuery,
      });
      this.isLoadingEvents = false;
    },

    /**
     * Shows assignees list for the specific event
     *
     * @param {string} projectId - id of the current project
     * @param {string} groupHash - group hash of the event day
     * @param {GroupedEvent} event - event to display assignees list
     */
    showAssignees(projectId, groupHash, event) {
      const boundingClientRect = event.target.closest('.event-item__assignee').getBoundingClientRect();

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
     * @param {string} groupHash - event's group hash
     * @param {string} repetitionId - event's repetition id
     */
    showEventOverview(projectId, groupHash, repetitionId) {
      if (this.isAssigneesShowed) {
        this.isAssigneesShowed = false;
      } else {
        this.$router.push({
          name: 'event-overview',
          params: {
            projectId: projectId,
            eventId: this.getEventByProjectIdAndGroupHash(projectId, groupHash).id,
            repetitionId: repetitionId,
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
        this.noMoreEvents = await this.$store.dispatch(FETCH_RECENT_EVENTS, {
          projectId: this.projectId,
          search: sanitizedQuery,
        });
      } finally {
        this.isLoadingEvents = false;
      }
    },

    incrementEventsLimit() {
      this.$store.dispatch(FETCH_PLANS).then(() => {
        this.$store.dispatch(SET_MODAL_DIALOG, {
          component: 'ChooseTariffPlanPopup',
          data: {
            workspaceId: this.project.workspaceId,
          },
        });
      });
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

    &__chart {
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

    &__blocked-banner {
      height: auto;
      margin: 15px 0;
      width: 100%;
      padding: 15px;
      color: var(--color-indicator-critical);
      font-size: 14px;
      line-height: 1.5;
      letter-spacing: 0.16px;
      background: color-mod(var(--color-indicator-critical) alpha(20%));
      border: 1px solid color-mod(var(--color-indicator-critical) alpha(20%));
      border-radius: 6px;

      &-header {
        margin-bottom: 15px;
        font-size: 16px;
      }

      &-button {
        margin-top: 15px;
      }
    }
  }

  .search-container {
    margin-top: 16px;
  }
</style>
