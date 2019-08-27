<template>
  <div class="project-overview">
    <div class="project-overview__content">
      <div class="project-overview__chart" />
      <div class="project-overview__events">
        <div
          v-for="(eventsByDate, date) in project.eventsListByDate"
          :key="date"
          class="project-overview__events-by-date"
        >
          <div class="project-overview__date">
            {{ date | prettyDate }}
          </div>
          <EventItem
            v-for="eventByDate in eventsByDate"
            :key="eventByDate.event.id"
            :count="eventByDate.count"
            class="project-overview__event"
            :event="eventByDate.event"
            @onAssigneeIconClick="showAssigners"
            @showEventOverview="$router.push({name: 'event-overview', params: { projectId: project.id, eventId: eventByDate.event.id }})"
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
import { FETCH_RECENT_ERRORS } from '../../store/modules/projects/actionTypes';
import AssignersList from '../events/AssignersList';

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
    }
  },
  created() {
    this.$store.dispatch(FETCH_RECENT_ERRORS, this.$route.params.projectId);
  },
  methods: {
    showAssigners(event) {
      this.isAssignersShowed = true;
      console.dir(event.target.closest('.event-item__assignee-icon').getBoundingClientRect());
      const boundingClientRect = event.target.closest('.event-item__assignee-icon').getBoundingClientRect();

      this.assignersListPosition = {
        top: boundingClientRect.y + 'px',
        left: boundingClientRect.x + 'px'
      };
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
