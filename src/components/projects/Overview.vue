<template>
  <div class="project-overview">
    <div
      v-infinite-scroll="loadMoreEvents"
      infinite-scroll-distance="300"
      class="project-overview__content"
    >
      <div class="project-overview__chart" />
      <div class="project-overview__events">
        <div
          v-for="(eventsByDate, date) in recentEvents"
          :key="date"
          class="project-overview__events-by-date"
        >
          <div class="project-overview__date">
            {{ date | prettyDateStr }}
          </div>
          <EventItem
            v-for="dailyEventInfo in eventsByDate"
            :key="dailyEventInfo.groupHash"
            :last-occurrence-timestamp="dailyEventInfo.timestamp"
            :count="dailyEventInfo.count"
            class="project-overview__event"
            :event="getEventByProjectIdAndGroupHash(project.id, dailyEventInfo.groupHash)"
            @onAssigneeIconClick="showAssigners"
            @showEventOverview="showEventOverview(project.id, dailyEventInfo.groupHash)"
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
import EventItem from '../events/EventItem';
import AssignersList from '../events/AssignersList';
import { mapGetters } from 'vuex';
import { FETCH_RECENT_EVENTS } from '../../store/modules/events/actionTypes';

export default {
  name: 'ProjectOverview',
  components: {
    EventItem,
    AssignersList
  },
  data() {
    return {
      noMoreEvents: true,
      isLoadingEvents: false,
      isAssignersShowed: false,
      assignersListPosition: {
        top: 0,
        right: 0
      }
    };
  },
  computed: {
    /**
     * Current viewed project
     * @return {Project}
     */
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.getProjectById(projectId);
    },

    /**
     * Project recent errors
     * @return {RecentInfoByDate}
     */
    recentEvents() {
      return this.$store.getters.getRecentEventsByProjectId(this.project.id);
    },

    ...mapGetters([ 'getEventByProjectIdAndGroupHash' ])
  },
  async created() {
    this.noMoreEvents = await this.$store.dispatch(FETCH_RECENT_EVENTS, { projectId: this.project.id });
  },
  methods: {
    /**
     * Load older events to the list
     */
    async loadMoreEvents() {
      if (this.noMoreEvents) {
        return;
      }
      this.isLoadingEvents = true;
      this.noMoreEvents = await this.$store.dispatch(FETCH_RECENT_EVENTS, { projectId: this.project.id });
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
        left: boundingClientRect.x + 'px'
      };
    },

    /**
     * Opens event overview popup
     * @param {String} projectId - id of the event's project
     * @param {String} groupHash - event's group hash
     */
    showEventOverview(projectId, groupHash) {
      this.$router.push({
        name: 'event-overview',
        params: {
          projectId: projectId,
          eventId: this.getEventByProjectIdAndGroupHash(projectId, groupHash).id
        }
      });
    },

    hideAssignersList() {
      this.isAssignersShowed = false;
    }
  }
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
