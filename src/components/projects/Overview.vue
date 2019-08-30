<template>
  <div class="project-overview">
    <div class="project-overview__content">
      <div class="project-overview__chart" />
      <div class="project-overview__events">
        <div
          v-for="(eventsByDate, date) in recentEvents"
          :key="date"
          class="project-overview__events-by-date"
        >
          <div class="project-overview__date">
            {{ date | prettyDate }}
          </div>
          <EventItem
            v-for="dailyEventInfo in eventsByDate"
            :key="dailyEventInfo.groupHash"
            :count="dailyEventInfo.count"
            class="project-overview__event"
            :event="getEventByProjectIdAndGroupHash(project.id, dailyEventInfo.groupHash)"
            @onAssigneeIconClick="showAssigners"
            @showEventOverview="showEventOverview(project.id, dailyEventInfo.groupHash)"
          />
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
import { FETCH_PROJECT_RECENT_EVENTS } from '../../store/modules/events/actionTypes';

export default {
  name: 'ProjectOverview',
  components: {
    EventItem,
    AssignersList
  },
  data() {
    return {
      eventsListByDate: null,
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
     * @return {RecentInfoByDate} Project recent errors
     */
    recentEvents() {
      return this.$store.getters.getRecentEventsByProjectId(this.project.id);
    },

    ...mapGetters([ 'getEventByProjectIdAndGroupHash' ])
  },
  created() {
    this.$store.dispatch(FETCH_PROJECT_RECENT_EVENTS, { projectId: this.project.id });
  },
  methods: {
    showAssigners(event) {
      this.isAssignersShowed = true;
      const boundingClientRect = event.target.closest('.event-item__assignee-icon').getBoundingClientRect();

      this.assignersListPosition = {
        top: boundingClientRect.y + 'px',
        left: boundingClientRect.x + 'px'
      };
    },

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
  }
</style>
