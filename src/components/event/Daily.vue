<template>
  <div class="event-daily">
    <div class="event-daily__section">
      <div class="event-daily__label">
        {{ $t('event.daily.lastTwoWeeks') }}
      </div>
      <Chart :points="chartData" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from '../events/Chart.vue';
import { GET_CHART_DATA } from '../../store/modules/events/actionTypes';
import { HawkEvent } from '../../types/events';
import { EventChartItem } from '../../types/chart';

export default Vue.extend({
  name: 'EventDaily',
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
     * Event's project
     */
    projectId: {
      type: String,
      required: true,
    },
  },
  data: function (): {chartData: EventChartItem[]} {
    return {
      /**
       * Data for a chart
       */
      chartData: [],
    };
  },
  /**
   * Vue created hook
   * Used to fetch events on component creation
   */
  async created(): Promise<void> {
    const twoWeeks = 14;
    const boundingDays = 2;

    if (!this.event.chartData) {
      await this.$store.dispatch(GET_CHART_DATA, {
        projectId: this.projectId,
        eventId: this.event.id,
        days: twoWeeks + boundingDays,
      });
    }

    this.chartData = this.event.chartData || [];
  },
});
</script>

<style>
  .event-daily {
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
  }
</style>
