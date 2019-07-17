<template>
  <div class="project-overview">
    <div class="project-overview__content">
      <div class="project-overview__chart" />
      <div class="project-overview__events">
        <div class="project-overview__date">
          Today
        </div>
        <EventItem
          v-for="event in project.events"
          :key="event.id"
          class="project-overview__event"
          :event="event"
          @click.native="$router.push({name: 'event-overview', params: { projectId: project.id, eventId: event.id }})"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import EventItem from '../EventItem';

export default {
  name: 'ProjectOverview',
  components: {
    EventItem
  },
  computed: {
    /**
     * Current viewed project
     * @return {Project}
     */
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.project(projectId);
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
      margin: 16px 15px 15px;
      background-color: var(--color-bg-main);
    }

    &__events {
      display: flex;
      flex-direction: column;
      margin: 50px 15px 15px;
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
  }
</style>
