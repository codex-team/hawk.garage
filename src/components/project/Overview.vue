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
        <div
          v-for="(eventsByDate, date) in recentEvents"
          :key="date"
          class="project-overview__events-by-date"
        >
          <div class="project-overview__date">
            {{ getDay(date) | prettyDate }}
          </div>
          <EventItem
            v-for="dailyEventInfo in eventsByDate"
            :key="dailyEventInfo.groupHash"
            :last-occurrence-timestamp="dailyEventInfo.lastRepetitionTime"
            :count="dailyEventInfo.count"
            class="project-overview__event"
            :event="getEventByProjectIdAndGroupHash(project.id, dailyEventInfo.groupHash)"
            @onAssigneeIconClick="showAssignees(project.id, dailyEventInfo.groupHash, $event)"
            @showEventOverview="showEventOverview(project.id, dailyEventInfo.groupHash, dailyEventInfo.lastRepetitionId)"
          />
        </div>
        <div
          v-if="Object.keys(recentEvents).length && !noMoreEvents"
          class="project-overview__load-more"
          :class="{'loader': isLoadingEvents}"
          @click="loadMoreEvents"
        >
          <span v-if="!isLoadingEvents">{{ $t('projects.loadMoreEvents') }}</span>
        </div>
        <div
          v-if="Object.keys(recentEvents).length === 0"
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

export default {
  name: 'ProjectOverview',
  components: {
    FiltersBar,
    EventItem,
    AssigneesList,
    Chart,
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
      onResize: () => {},

      /**
       * Old window width
       */
      windowWidth: window.innerWidth,
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
  },

  /**
   * Vue created hook
   * Used to fetch events on component creation
   */
  async created() {
    this.noMoreEvents = await this.$store.dispatch(FETCH_RECENT_EVENTS, { projectId: this.projectId });

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
  },

  /**
   * Vue mounted hook
   * Used to update user's last project visit time
   */
  mounted() {
    this.$store.dispatch(UPDATE_PROJECT_LAST_VISIT, { projectId: this.projectId });
  },

  /**
   * Before route enter hook
   * Redirects to add-catcher page if there aren't any events
   *
   * @param to - next route
   * @param from - previous route
   * @param next - this function must be called to resolve the hook
   */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const recentEvents = vm.$store.getters.getRecentEventsByProjectId(vm.projectId);

      /**
       * Push to add-catcher page if there aren't events
       */
      if (!recentEvents) {
        next({
          name: 'add-catcher',
          params: { projectId: vm.projectId },
        });
      }
      next();
    });
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
      this.noMoreEvents = await this.$store.dispatch(FETCH_RECENT_EVENTS, { projectId: this.projectId });
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
      margin: 15px 15px 0;
    }

    &__events {
      display: flex;
      flex-direction: column;
      padding: 0 15px 15px;
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
</style>
