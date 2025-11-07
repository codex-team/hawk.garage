<template>
  <div class="project-chart">
    <div class="project-chart__controls">
      <UiSelect
        v-model="chartRange"
        :options="rangeOptions"
      />
      <UiSelect
        v-model="chartGrouping"
        :options="groupingOptions"
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
    } {
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
    };
  },
  computed: {
    /**
     * Options for chart grouping with disabled state based on selected range
     */
    groupingOptions(): UiSelectOption[] {
      const allOptions: UiSelectOption[] = [
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
      ];

      /* Set disabled state based on selected range */
      switch (this.chartRange) {
        case 'hour':
          /* hour -> only minutes */
          return allOptions.map(option => ({
            ...option,
            isDisabled: option.value !== 'minutes',
          }));
        case 'day':
          /* day -> hours, minutes */
          return allOptions.map(option => ({
            ...option,
            isDisabled: option.value === 'days',
          }));
        case 'week':
          /* week -> hours, days */
          return allOptions.map(option => ({
            ...option,
            isDisabled: option.value === 'minutes',
          }));
        case 'month':
          /* month -> only days */
          return allOptions.map(option => ({
            ...option,
            isDisabled: option.value !== 'days',
          }));
        default:
          return allOptions;
      }
    },

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
  watch: {
    /**
     * Refetch chart data when project id changes
     */
    projectId: {
      immediate: true,
      handler() {
        void this.fetchChartData();
      },
    },
    chartRange: {
      handler(newVal) {
        /* Reset grouping if current grouping is disabled for new range */
        const currentOption = this.groupingOptions.find(opt => opt.value === this.chartGrouping);

        if (currentOption && currentOption.isDisabled) {
          /* Set to first enabled option */
          const enabledOption = this.groupingOptions.find(opt => !opt.isDisabled);

          if (enabledOption) {
            this.chartGrouping = enabledOption.value;
          }
        }
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
    async fetchChartData(): Promise<void> {
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

      /* Update local chartData from store */
      this.chartData = this.$store.state.projects.charts[this.projectId] || [];
    },
    changeChartRange(range: string): void {
      this.chartRange = range;
    },
    changeChartGrouping(grouping: string): void {
      this.chartGrouping = grouping;
    },
    isGroupingAvailable(grouping: string): boolean {
      return true;
    },
    isRangeAvailable(range: string): boolean {
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
    z-index: 2;
    display: flex;
    gap: 4px;
    align-items: center;

    &-today {
      padding: 6px 9px;
      font-weight: 500;
      font-size: 12px;
      line-height: 12px;
      background-color: var(--color-bg-second);
      border-radius: 7px;

      &-count {
        margin-left: 4px;
      }

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

        &-decrease::before {
          top: 35%
        }
      }
    }
  }
}
</style>
