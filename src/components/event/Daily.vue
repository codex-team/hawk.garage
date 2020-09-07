<template>
  <div class="event-daily">
    <div class="event-daily__section">
      <div class="event-daily__label">
        {{ $t('event.repetitions.since') }}
      </div>
      <div class="event-daily__since">
        13 juk, 15:50
        <span
          class="event-repetitions__since-days"
        >
          — {{ $tc('event.repetitions.days', 55) }}
        </span>
      </div>
    </div>
    <div class="event-daily__section">
      <div class="event-daily__label">
        {{ $t('event.daily.lastTwoWeeks') }}
      </div>
      <Chart :points="chartData" />
    </div>
  </div>
</template>

<script lang="ts">
import Chart from '../events/Chart.vue';
import { GET_CHART_DATA } from '../../store/modules/events/actionTypes';
import { HawkEvent } from '@/types/events';

export default {
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
  },
  data() {
    return {
      /**
       * Data for a chart
       *
       * @type {EventChartItem[]}
       */
      chartData: [],
    };
  },
  computed: {
    /**
     * Returns project id from the route
     *
     * @returns {string}
     */
    projectId() {
      return this.$route.params.projectId;
    },

    /**
     * Return event id from the route
     */
    eventId() {
      return this.$route.params.eventId;
    },
  },
  /**
   * Vue created hook
   * Used to fetch events on component creation
   */
  async created() {
    const twoWeeks = 14;
    const boundingDays = 2;

    if (this.event.chartData) {
      await this.$store.dispatch(GET_CHART_DATA, {
        projectId: this.projectId,
        eventId: this.eventId,
        days: twoWeeks + boundingDays,
      });
    }

    this.chartData = this.event.chartData;
  },
};
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
