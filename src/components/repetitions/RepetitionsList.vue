<template>
  <div class="repetitions-list repetitions-list--by-date">
    <div class="repetitions-list__date">
      7 may
    </div>
    <table class="repetitions-table">
      <tr
        v-for="repetition in repetitions"
        class="repetitions-table__row"
      >
        <td class="repetitions-table__col">
          {{ repetition.payload.timestamp | prettyTime }}
        </td>
        <td class="repetitions-table__col user-info">
          <img
            class="user-info__photo"
            src="https://as1.ftcdn.net/jpg/02/18/69/42/500_F_218694229_V1sjTE7s6ROXQYGPyUcZSIHatGT4nOK9.jpg"
            alt=""
          >
        </td>
        <td class="repetitions-table__col user-info">
          <span class="user-info__name">{{ repetition.payload.user ? repetition.payload.user.name : 'username' }}</span>
        </td>
        <td class="repetitions-table__col user-info">
          <span class="user-info__os">Linux</span>
        </td>
        <td class="repetitions-table__col user-info">
          <span class="user-info__browser">Firefox 61.0</span>
        </td>
        <td class="repetitions-table__col user-info">
          <span class="user-info__screen">1920x946</span>
        </td>
        <td class="repetitions-table__col user-info">
          <span class="user-info__url">/startup/primeliber-com/blog/15598/8-instrumentov-dl…</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { FETCH_EVENT_REPETITIONS } from '../../store/modules/events/actionTypes';

export default {
  name: 'RepetitionsList',
  components: {
  },
  data() {
    const projectId = this.$route.params.projectId;
    const eventId = this.$route.params.eventId;
    const currentEvent = this.$store.getters.findProjectEventById(projectId, eventId);

    return {
      projectId: projectId,
      eventId: eventId,
      repetitions: [ currentEvent ]
    };
  },
  async created() {
    const projectId = this.projectId;
    const eventId = this.eventId;
    const repetitions = await this.$store.dispatch(FETCH_EVENT_REPETITIONS, { projectId, eventId });

    repetitions.forEach(event => {
      this.repetitions.push(event);
    });
  }
};
</script>

<style>
  .repetitions-list {
    margin-bottom: 20px;
    &--by-date {
      color: var(--color-text-main);
      font-size: 14px;
      opacity: 0.6;
    }

    &__date {
      margin-bottom: 18px;
    }
  }

  .repetitions-table {
    width: 100%;
    margin-left: -10px;
    border-spacing: 0;

    &__row:nth-child(even) {
      background-color: #242732;
    }

    &__col {
      padding: 14px 10px;
    }

    &__only-date {
      display: block;
      margin-top: 20px;
      margin-bottom: 18px;
    }

    &__item-time {
      width: 40px;
    }
  }

  .user-info {
    &__photo {
      width: 25px;
      height: 25px;
      border-radius: 3px;
    }

    &__name {
    }

    &__name,
    &__os,
    &__browser {
      font-weight: bold;
      font-size: 13px;
    }

    &__url {
      color: rgba(219, 230, 255, 0.6);
    }
  }
</style>
