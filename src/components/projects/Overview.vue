<template>
  <div class="project-overview">
    <div class="project-overview__header">
      <div
        class="project-overview__icon"
        :style="{ backgroundImage: `url('${project.image}')` }"
      ></div>
      <div class="project-overview__name">
        {{project.name}}
      </div>
      <Icon class="project-overview__notifications" symbol="bell"/>
    </div>
    <div class="project-overview__chart">

    </div>
    <div class="project-overview__events">
      <div class="project-overview__date">
        Today
      </div>
      <EventItem
        class="project-overview__event"
        v-for="event in project.events"
        :key="event.id"
        :event="event"
        @click.native="$router.push({name: 'event-overview', params: { projectId: project.id, eventId: event.id }})"
      />
    </div>
    <router-view/>
  </div>
</template>

<script>
import EventItem from '../EventItem';
import Icon from '../utils/Icon';

export default {
  name: 'ProjectOverview',
  computed: {
    /**
     * Current viewed project
     * @return {Project}
     */
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.project(projectId);
    }
  },
  components: {
    EventItem,
    Icon
  }
};
</script>

<style>
  .project-overview {
    height: 100%;

    &__header {
      display: flex;
      align-items: center;
      height: 50px;
      box-shadow: 0 1px 5px 0 var(--color-bg-main), inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
    }

    &__icon {
      width: 26px;
      height: 26px;
      margin-left: 15px;
      background-position: center center;
      background-size: cover;
      border-radius: var(--border-radius);
    }

    &__name {
      margin-left: 10px;
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;
    }

    &__notifications {
      width: 17px;
      height: 20px;
      margin-right: 19px;
      margin-left: auto;
      cursor: pointer;
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
