<template>
  <div class="project-overview">
    <div
      v-if="project"
      v-infinite-scroll="loadMoreEvents"
      infinite-scroll-distance="300"
      class="project-overview__content"
    >
      <Chart v-bind:days="chartData"/>
      <div class="project-overview__events">
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
            @onAssigneeIconClick="showAssigners"
            @showEventOverview="showEventOverview(project.id, dailyEventInfo.groupHash, dailyEventInfo.lastRepetitionId)"
          />
        </div>
        <div
          v-if="!noMoreEvents"
          class="project-overview__load-more"
          :class="{'loader': isLoadingEvents}"
          @click="loadMoreEvents"
        >
          <span v-if="!isLoadingEvents">Load more events</span>
        </div>
        <AssignersList
          v-if="isAssignersShowed"
          v-click-outside="hideAssignersList"
          :style="assignersListPosition"
          class="project-overview__assigners-list"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import EventItem from './EventItem';
import AssignersList from '../event/AssignersList';
import Chart from '../events/Chart';
import { mapGetters } from 'vuex';
import { FETCH_RECENT_EVENTS, FETCH_CHART_DATA } from '../../store/modules/events/actionTypes';
import { UPDATE_PROJECT_LAST_VISIT } from '../../store/modules/projects/actionTypes';

export default {
  name: 'ProjectOverview',
  components: {
    EventItem,
    AssignersList,
    Chart
  },
  data() {
    return {
      noMoreEvents: true,
      isLoadingEvents: false,
      isAssignersShowed: false,
      chartData: [],
      assignersListPosition: {
        top: 0,
        right: 0,
      },
    };
  },
  computed: {
    /**
     * Returns project id from the route
     * @return {string}
     */
    projectId() {
      return this.$route.params.projectId;
    },

    /**
     * Current viewed project
     * @return {Project}
     */
    project() {
      return this.$store.getters.getProjectById(this.projectId);
    },

    /**
     * Project recent errors
     * @return {RecentInfoByDate}
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
    this.chartData = await this.$store.dispatch(FETCH_CHART_DATA, {projectId: this.projectId, minTimestamp: ~~(Date.now() / 1000 - 86400 * 16) });
  },

  /**
   * Vue mounted hook
   * Used to update user's last project visit time
   */
  mounted() {
    this.$store.dispatch(UPDATE_PROJECT_LAST_VISIT, { projectId: this.projectId });
  },
  methods: {
    /**
     * Return passed day midnight timestamp
     * @param {string} date - grouped day key like 'date:1576011600'
     * @return {number}
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
     * Shows assigners list for the specific event
     * @param {GroupedEvent} event - event to display assigners list
     */
    showAssigners(event) {
      this.isAssignersShowed = true;
      const boundingClientRect = event.target.closest('.event-item__assignee-icon').getBoundingClientRect();

      this.assignersListPosition = {
        top: boundingClientRect.y + 'px',
        left: boundingClientRect.x + 'px',
      };
    },

    /**
     * Opens event overview popup
     * @param {String} projectId - id of the event's project
     * @param {String} groupHash - event's group hash
     * @param {String} repetitionId - event's repetition id
     */
    showEventOverview(projectId, groupHash, repetitionId) {
      this.$router.push({
        name: 'event-overview',
        params: {
          projectId: projectId,
          eventId: this.getEventByProjectIdAndGroupHash(projectId, groupHash).id,
          repetitionId: repetitionId,
        },
      });
    },

    hideAssignersList() {
      this.isAssignersShowed = false;
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
      height: 215px;
      margin: 16px 15px 0;
      background-color: var(--color-bg-main);
    }

    &__events {
      display: flex;
      flex-direction: column;
      padding: 0 15px 15px;
    }

    &__events-by-date {
      margin-top: 50px;
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

    &__assigners-list {
      position: absolute;
      transform: translateX(-100%) translate(-5px, -5px);
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
  }
</style>
