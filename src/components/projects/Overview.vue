<template>
  <div class="project-overview">
    <div class="project-overview__content">
      <div class="project-overview__chart" />
      <div class="project-overview__events">
        <div
          v-for="(eventsByDate, date) in eventsListByDate"
          :key="date"
          class="project-overview__events-by-date"
        >
          <div class="project-overview__date">
            {{ date | prettyDate }}
          </div>
          <EventItem
            v-for="eventByDate in eventsByDate"
            :key="eventByDate.event.id"
            class="project-overview__event"
            :event="eventByDate.event"
            @click.native="$router.push({name: 'event-overview', params: { projectId: project.id, eventId: eventByDate.event.id }})"
          />
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import EventItem from '../EventItem';
import { FETCH_PROJECT_EVENTS } from '../../store/modules/projects/actionTypes';
import * as api from '../../api';

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];

    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

const groupByDate = groupBy('date');

export default {
  name: 'ProjectOverview',
  components: {
    EventItem
  },
  data() {
    return {
      eventsListByDate: null
    };
  },
  async created() {
    const projectId = this.$route.params.projectId;

    // language=GraphQL
    const request = `
query RecentEvents (
$projectId: ID!
){
recent(projectId: $projectId) {
count
date
event {
        id
        payload {
          title
          timestamp
        }
      }
}
}
      `;

    const result = (await api.call(request, { projectId })).recent;

    this.eventsListByDate = groupByDate(result);
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
  }
</style>
