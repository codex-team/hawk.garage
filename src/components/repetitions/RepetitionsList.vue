<template>
  <div class="repetitions-list">
    <div class="repetitions-list__by-date">
      <table class="event-repetitions">
        <tr class="event-repetitions__only-date">
          <td class="event-repetitions__item-date"></td>
        </tr>
        <tr
          v-for="repetition in repetitions"
          class="event-repetitions__item"
        >
          <td class="event-repetitions__item-time">{{ repetition.payload.timestamp | prettyTime}}</td>
          <td class="event-repetitions__item-user-photo">{{ repetition.payload.user ? repetition.payload.user.image : ''}}</td>
          <td class="event-repetitions__item-user-name">{{ repetition.payload.user ? repetition.payload.user.name : ''}}</td>
          <td class="event-repetitions__item-user-os">Linux</td>
          <td class="event-repetitions__item-user-browser">Firefox 61.0</td>
          <td class="event-repetitions__item-user-screen">1920x946</td>
          <td class="event-repetitions__item-page">/startup/primeliber-com/blog/15598/8-instrumentov-dl…</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { FETCH_EVENT_REPETITIONS } from '../../store/modules/events/actionTypes';

export default {
  name: 'RepetitionsList',
  components: {
  },
  data() {
    return {
      projectId: this.$route.params.projectId,
      eventId: this.$route.params.eventId
    };
  },
  computed: {
    repetitions() {
      return this.$store.state.events.repetitions[this.eventId];
    }
  },
  mounted() {
    const projectId = this.projectId;
    const eventId = this.eventId;

    this.$store.dispatch(FETCH_EVENT_REPETITIONS, { projectId, eventId });
  },
  methods: {
    // prettyTime
  }
};
</script>

<style>
  .repetitions-list {
    &__by-date {
      color: var(--color-text-main);
      font-size: 14px;
      opacity: 0.6;
    }
  }

  .event-repetitions {
    &__only-date {
      display: block;
      margin-top: 20px;
      margin-bottom: 18px;
    }

    &__item {
      &-date,
      &-time {
        width: 45px;
      }

      &-user-name,
      &-user-os,
      &-user-browser {
        font-weight: bold;
        font-size: 13px;
      }

      &-page {
        color: rgba(219, 230, 255, 0.6);
      }
    }
  }
</style>
