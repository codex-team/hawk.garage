<template>
  <div class="event-users-affected">
    <div class="event-users-affected__section">
      <div class="event-users-affected__label">
        {{ $t('event.usersAffected.total') }}
      </div>
      <div
        v-if="event"
        class="event-users-affected__affected"
      >
        {{ $tc('event.usersAffected.users', event.usersAffected) }}
      </div>
      <div class="event-users-affected__section">
        <div class="event-users-affected__label">
          {{ $t('event.daily.lastTwoWeeks') }}
        </div>
        <Chart :points="chartData" label="event.usersAffected.label" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { HawkEvent } from '@/types/events';
import { GET_AFFECTED_USERS_CHART_DATA } from '../../store/modules/events/actionTypes';
import Chart from '../events/Chart.vue';
import { EventChartItem } from '../../types/chart';

export default Vue.extend({
  name: 'UsersAffectedOverview',
  components: {
    Chart
  },
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
      chartData: [] as EventChartItem[],
    };
  },
  /**
   * Vue created hook
   * Used to fetch affected users on component creation
   */
  async created(): Promise<void> {
    const twoWeeks = 14;
    const boundingDays = 2;

    if (!this.event.affectedUsersChartData) {
      await this.$store.dispatch(GET_AFFECTED_USERS_CHART_DATA, {
        projectId: this.projectId,
        eventId: this.event.id,
        days: twoWeeks + boundingDays,
      });
    }

    this.chartData = this.event.affectedUsersChartData || [];
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

    &__affected {
      margin-bottom: 25px;

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
  }
</style>
