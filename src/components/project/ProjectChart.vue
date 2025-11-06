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
    </div>
    <Chart
      :points="chartData"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from '../events/Chart.vue';
import { FETCH_CHART_DATA } from '@/store/modules/projects/actionTypes';
import UiSelect from '../utils/UiSelect.vue';

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
  data() {
    return {
      /**
       * Data for a chart
       */
      chartData: [],

      /**
       * Chart range: 'hour', 'day', 'week', 'month'
       */
      chartRange: 'day',

      /**
       * Chart grouping: 'minutes', 'hours', or 'days'
       */
      chartGrouping: 'hours',

      /**
       * Options for chart range
       */
      rangeOptions: [
        {
          label: this.$t('projects.chart.lastHour'),
          value: 'hour',
        },
        {
          label: this.$t('projects.chart.lastDay'),
          value: 'day',
        },
        {
          label: this.$t('projects.chart.lastWeek'),
          value: 'week',
        },
        {
          label: this.$t('projects.chart.lastMonth'),
          value: 'month',
        },
      ],

      /**
       * Options for chart grouping
       */
      groupingOptions: [
        {
          label: this.$t('projects.chart.byMinutes'),
          value: 'minutes',
        },
        {
          label: this.$t('projects.chart.byHours'),
          value: 'hours',
        },
        {
          label: this.$t('projects.chart.byDays'),
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
    gap: 10px;
    z-index: 2;
  }
}
</style>
