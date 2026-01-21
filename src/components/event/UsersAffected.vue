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
        {{ $t('event.usersAffected.users', { n: event.usersAffected }) }}
      </div>
    </div>
    <div class="event-users-affected__section">
      <div class="event-users-affected__label">
        {{ $t('event.daily.lastTwoWeeks') }}
      </div>
      <Chart :lines="chartData" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { HawkEvent } from '@/types/events';
import Chart from '../events/Chart.vue';
import { GET_AFFECTED_USERS_CHART_DATA } from '../../store/modules/events/actionTypes';
import { ChartLine } from '@/types/chart';

export default defineComponent({
  name: 'UsersAffectedOverview',
  components: {
    Chart,
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
  data: function (): {
    /**
     * Set of lines for a chart
     */
    chartData: ChartLine[];
  } {
    return {
      /**
       * Data for a chart
       */
      chartData: [],
    };
  },
  /**
   * Vue created hook
   * Used to fetch chart data on component creation
   */
  async created(): Promise<void> {
    const twoWeeks = 14;
    const boundingDays = 2;

    if (!this.event.affectedUsersChartData) {
      await this.$store.dispatch(GET_AFFECTED_USERS_CHART_DATA, {
        projectId: this.projectId,
        eventId: this.event.id,
        originalEventId: this.event.originalEventId,
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
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 24px;
    }
  }
</style>
