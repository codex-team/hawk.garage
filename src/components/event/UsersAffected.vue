<template>
  <div class="event-users-affected">
    <div class="event-users-affected__section">
      <div class="event-users-affected__label">
        {{ $t('event.usersAffected.total') }}
      </div>
      <div
        v-if="event"
        class="event-users-affected__repeats"
      >
        {{ $tc('event.usersAffected.users', event.usersAffected) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { HawkEvent } from '@/types/events';

export default Vue.extend({
  name: 'UsersAffectedOverview',
  props: {
    /**
     * Viewed event
     */
    event: {
      type: Object as () => HawkEvent,
      required: true,
    },

    /**
     * Project what owns event
     */
    projectId: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      groupedRepetitions: new Map(),
    };
  },
  computed: {
    originalEvent(): HawkEvent {
      return this.$store.getters.getProjectEventById(this.projectId, this.event.id);
    },
  },
});
</script>

<style>
  .event-users-affected {
    &__section {
      margin-bottom: 30px;
    }

    &__label {
      margin-bottom: 10px;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.15px;
      text-transform: uppercase;
    }

    &__repeats {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 24px;
    }

    &__since {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;

      &-days {
        color: var(--color-text-second);
      }
    }

    &__table {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
</style>
