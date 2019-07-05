<template>
  <div class="project-overview">
    <div class="project-overview__header">
      <div
        class="project-overview__icon"
        :style="{ backgroundImage: `url('${project.picture}')` }"
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
        v-for="event in events"
        :key="event.id"
        :event="event"
      ></EventItem>
    </div>
  </div>
</template>

<script>
import EventItem from '../EventItem';
import Icon from '../Icon';

export default {
  name: 'ProjectOverview',
  data() {
    return {
      events: [
        {
          id: '2342342edwdwed',
          time: 'now',
          count: 2342,
          info: 'Error fetching remote / [ status 0 ] Could not resolve host: detik.com'
        },
        {
          id: '2342342edwdwedqwd',
          time: '13:51',
          count: 232,
          info: 'Uncaught Error: Can not find a Block from this child Node'
        }
      ]
    };
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
    user-select: none;

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
