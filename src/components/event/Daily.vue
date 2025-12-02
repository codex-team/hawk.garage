<template>
  <div class="event-daily">
    <div class="event-daily__section">
      <div class="event-daily__label">
        {{ $t('event.repetitions.since') }}
      </div>
      <div class="event-daily__since">
        {{ formattedDate }}
        <span
          v-if="daysRepeating > 1"
          class="event-daily__since-days"
        >
          — {{ $t('event.repetitions.days', { n: daysRepeating }) }}
        </span>
      </div>
    </div>
    <div class="event-daily__section">
      <div class="event-daily__label">
        {{ $t('event.daily.lastTwoWeeks') }}
      </div>
      <Chart :lines="chartData" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chart from '../events/Chart.vue';
import { GET_CHART_DATA } from '../../store/modules/events/actionTypes';
import { HawkEvent } from '../../types/events';
import { prettyFullDate } from '../../utils/filters';
import { ChartLine } from '@/types/chart';

export default defineComponent({
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
  computed: {
    /**
     * Return formatted date using prettyFullDate utility
     */
    formattedDate(): string {
      if (!this.event?.originalTimestamp) {
        return '';
      }

      return prettyFullDate(this.event.originalTimestamp);
    },

    /**
     * Return concrete date
     */
    daysRepeating(): number {
      if (!this.event) {
        return 0;
      }

      const now = (new Date()).getTime();
      const eventTimestamp = this.event.originalTimestamp * 1000;
      const firstOccurrence = (new Date(eventTimestamp).getTime());
      const differenceInDays = (now - firstOccurrence) / (1000 * 3600 * 24);

      return Math.round(differenceInDays);
    },
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
        originalEventId: this.event.originalEventId,
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
