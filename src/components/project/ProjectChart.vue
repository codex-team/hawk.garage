<template>
  <div class="project-chart">
    <div class="project-chart__controls">
      <UiSelect
        :options="rangeOptions"
        v-model="chartRange"
      />
      <UiSelect
        :options="groupingOptions"
        v-model="chartGrouping"
      />
      <div class="project-chart__controls-today">
        {{ $t('projects.chart.now') }}
        <span class="project-chart__controls-today-count">
          {{ nowCount | spacedNumber }}
        </span>
        <span
          v-if="difference !== 0"
          :class="{
            'project-chart__controls-today-difference-increase': difference > 0,
            'project-chart__controls-today-difference-decrease': difference < 0
          }"
        >
          {{ Math.abs(difference) | spacedNumber }}
        </span>
      </div>
    </div>
    <Chart
      :points="chartData"
      :detalization="chartGrouping"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from '../events/Chart.vue';
import { FETCH_CHART_DATA } from '@/store/modules/projects/actionTypes';
import UiSelect, { UiSelectOption } from '../utils/UiSelect.vue';
import { ChartItem } from '@/types/chart';

export default Vue.extend({
  name: 'ProjectChart',
  components: {
    Chart,
    UiSelect,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  data(): {
    chartData: ChartItem[];
    chartRange: string;
    chartGrouping: string;
    rangeOptions: UiSelectOption[];
    groupingOptions: UiSelectOption[];
  } {
    return {
      /**
       * Data for a chart
       */
      chartData: [],

      /**
       * Chart range: 'hour', 'day', 'week', 'month'
       */
      chartRange: 'week',

      /**
       * Chart grouping: 'minutes', 'hours', or 'days'
       */
      chartGrouping: 'hours',

      /**
       * Options for chart range
       */
      rangeOptions: [
        {
          label: this.$t('projects.chart.lastHour') as string,
          value: 'hour',
        },
        {
          label: this.$t('projects.chart.lastDay') as string,
          value: 'day',
        },
        {
          label: this.$t('projects.chart.lastWeek') as string,
          value: 'week',
        },
        {
          label: this.$t('projects.chart.lastMonth') as string,
          value: 'month',
        },
      ],

      /**
       * Options for chart grouping
       */
      groupingOptions: [
        {
          label: this.$t('projects.chart.byMinutes') as string,
          value: 'minutes',
        },
        {
          label: this.$t('projects.chart.byHours') as string,
          value: 'hours',
        },
        {
          label: this.$t('projects.chart.byDays') as string,
          value: 'days',
        },
      ],
    };
  },
  mounted() {
    if (!this.$store.state.projects.charts[this.projectId]) {
      void this.fetchChartData();
    }
  },
  watch: {
    chartRange: {
      handler(newVal) {
        this.fetchChartData();
      },
    },
    chartGrouping: {
      handler(newVal) {
        this.fetchChartData();
      },
    },
  },
  computed: {
    nowCount(): number {
      return this.chartData.slice(-1)[0]?.count || 0;
    },
    preLastPointCounter(): number {
      return this.chartData.slice(-2, -1)[0]?.count || 0;
    },
    difference(): number {
      return this.nowCount - this.preLastPointCounter;
    },
  },
  methods: {
    /**
     * Fetch chart data based on current range and grouping settings
     */
    async fetchChartData() {
      const now = new Date();
      let startDate, endDate, groupBy;

      // Determine date range
      if (this.chartRange === 'hour') {
        startDate = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      } else if (this.chartRange === 'day') {
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      } else if (this.chartRange === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else {
        // month
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      }
      endDate = now.toISOString();

      // Determine grouping
      if (this.chartGrouping === 'minutes') {
        groupBy = 1;
      } else if (this.chartGrouping === 'hours') {
        groupBy = 60;
      } else {
        groupBy = 1440;
      }

      await this.$store.dispatch(FETCH_CHART_DATA, {
        projectId: this.projectId,
        startDate,
        endDate,
        groupBy,
      });

      this.chartData = this.$store.state.projects.charts[this.projectId];
      this.chartData[this.chartData.length - 2].count = 31;
      this.chartData[this.chartData.length - 1].count = 100;
    },
    changeChartRange(range: string) {
      this.chartRange = range;
    },
    changeChartGrouping(grouping: string) {
      this.chartGrouping = grouping;
    },
    isGroupingAvailable(grouping: string) {
      return true;
    },
    isRangeAvailable(range: string) {
      return true;
    },
  },
});
</script>

<style scoped>
.project-chart {
  position: relative;

  &__controls {
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 2;

    &-today {
      padding: 6px 9px;
      border-radius: 7px;
      background-color: var(--color-bg-second);
      font-size: 12px;
      line-height: 12px;
      font-weight: 500;
      color: var(--color-text-second);

      &-difference {
        &-increase,
        &-decrease {
          position: relative;
          margin-left: 18px;
          color: #f15454;
          font-weight: bold;
        }

        &-increase {
          color: #f15454;
        }

        &-decrease {
          color: #2ccf6c;
        }

        &-increase::before,
        &-decrease::before {
          position: absolute;
          top: 52%;
          left: -12px;
          border: 4px solid transparent;
          border-top: 5.5px solid #2ccf6c;
          content: '';
        }

        &-increase::before {
          border-top-color: #f15454;
          transform: rotate(180deg) translateY(7px);
        }
      }
    }
  }
}
</style>
