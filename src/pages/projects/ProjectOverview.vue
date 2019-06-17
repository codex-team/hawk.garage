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
      <div class="project-overview__notifications"></div>
    </div>
    <div class="project-overview__chart">

    </div>
    <div class="project-overview__events">
      <div class="project-overview__date">Today</div>
      <EventItem
        v-for="event in events"
        :key="event.id"
        :event="event"
      ></EventItem>
    </div>
  </div>
</template>

<script>
import EventItem from '../../components/EventItem';

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
    EventItem
  }
};
</script>

<style>
  .project-overview {
    background-color: var(--color-bg-second);
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
      background-size: cover;
      background-position: center center;
      border-radius: 10px;
      margin-left: 15px;
    }

    &__name {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;
      margin-left: 10px;
    }

    &__chart {
      height: 215px;
      background-color: var(--color-bg-main);
      margin: 16px 15px 15px;
    }

    &__events {
      display: flex;
      flex-direction: column;
      margin: 50px 15px 15px;
    }

    &__date {
      font-size: 14px;
      color: var(--color-text-second);
      margin-bottom: 20px;
    }
  }
</style>
