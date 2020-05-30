<template>
  <div class="project-overview__chart">
    <div
      v-if="days.length > 1"
      class="project-overview__chart-info"
    >
      <span class="project-overview__chart-info__today"> today </span>
      <span class="project-overview__chart-info__highlight"> {{ todayCount }} </span>

      <span
        v-if="difference !== 0"
        :class="{
          'project-overview__chart-info-increase': difference > 0,
          'project-overview__chart-info-decrease': difference < 0
        }"
      >
        {{ Math.abs(difference) | spacedNumber }}
      </span>
    </div>
    <svg class="project-overview__chart-body">
      <defs>
        <linearGradient
          id="chart"
          gradientTransform="rotate(90)"
        >
          <stop
            offset="0%"
            style="stop-color:rgba(61, 133, 210, 0.22);"
          />
          <stop
            offset="100%"
            style="stop-color:#ff4c4c;"
          />
        </linearGradient>
      </defs>
      <polyline
        class="chart_body-polyline"
        fill="none"
        :stroke="minCount !== maxCount ? 'url(#chart)' : 'rgba(61, 133, 210, 0.22)'"
        stroke-width="2.5"
        :points="polylinePoints"
      />
    </svg>
    <div class="project-overview__chart-days">
      <span
        v-for="(day, index) in visibleDays"
        :key="index"
        class="project-overview__chart-day"
      >
        {{ day.timestamp * 1000 | prettyDateFromTimestamp }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from '@/utils';
import { ProjectChartItem } from '../../types/chart';

export default Vue.extend({
  name: 'Chart',
  props: {
    /**
     * List of days with the number of errors per day
     */
    days: {
      type: Array as () => ProjectChartItem[],
      default: () => [] as ProjectChartItem[],
    },
  },
  data() {
    return {
      /**
       * points for svg polyline
       *
       * @type {string}
       */
      polylinePoints: '' as string,

      /**
       * Event on window resize
       *
       * @returns {void}
       */
      onResize: () => {},
    };
  },
  computed: {
    /**
     * Number of errors for the current day
     *
     * @returns {number}
     */
    todayCount(): number {
      return this.days.slice(-1)[0].count || 0;
    },

    /**
     * Number of errors for the previous day
     *
     * @returns {number}
     */
    yesterdayCount(): number {
      return this.days.slice(-2, -1)[0].count || 0;
    },

    /**
     * Difference between current and previous number of errors
     *
     * @returns {number}
     */
    difference(): number {
      return this.todayCount - this.yesterdayCount;
    },

    /**
     * Days used in chart
     *
     * @returns {number}
     */
    visibleDays(): any[] {
      return this.days.slice(1, -1);
    },

    /**
     * Minimum number errors per day
     *
     * @returns {number}
     */
    minCount(): number {
      return Math.min(...this.days.map(day => day.count));
    },

    /**
     * Maximum number errors per day
     *
     * @returns {number}
     */
    maxCount(): number {
      return Math.max(...this.days.map(day => day.count));
    },
  },
  watch: {
    /**
     * Creates a polyline by day
     */
    days: function () {
      this.createPolyline();
    },
  },
  created() {
    this.onResize = debounce(this.createPolyline, 100);
  },
  mounted() {
    this.createPolyline();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    /**
     * Logic for create polyline for chart
     * Set x y coordinates separated by a comma
     */
    createPolyline(): void {
      const step = this.$el.clientWidth / (this.days.length - 1);
      const points : string[] = [];

      this.days.forEach((day, index) => {
        const pointX = index * step;
        let pointY = 2;

        if (this.maxCount != this.minCount) {
          pointY += (day.count - this.minCount) / (this.maxCount - this.minCount) * 100;
        }

        points.push(pointX + ' ' + pointY);
      });

      this.polylinePoints = points.join(', ');
    },
  },
});
</script>
<style>
  .project-overview__chart {
    position: relative;
    height: 215px;
    margin: 16px 15px 0;
    background-color: var(--color-bg-main);

    &-info {
      float: right;
      padding: 15px 15px 20px 0;
      color: var(--color-text-main);
      font-size: 13px;
      white-space: nowrap;

      &__today {
        opacity: 0.6;
      }

      &__highlight {
        margin-left: 6px;
        font-weight: bold;
      }

      &-increase, &-decrease {
        position: relative;
        margin-left: 32px;
        color: #f15454;
        font-weight: bold;
        font-size: 13px;
      }

      &-increase {
        color: #f15454;
      }

      &-decrease {
        color: #2ccf6c;
      }

      &-increase::before, &-decrease::before {
        position: absolute;
        top: 4px;
        left: -18px;
        border: 5.5px solid transparent;
        border-top: 9px solid #2ccf6c;
        content: '';
      }

      &-increase::before {
        border-top-color: #f15454;
        transform: rotate(180deg) translateY(7px);
      }
    }

    &-body {
      width: 100%;
      height: 105px;
      transform: scale(1, -1);
    }

    &-days {
      position: absolute;
      bottom: 15px;
      display: flex;
      justify-content: space-between;
      width: 93.75%;
      margin-left: 3.125%;
    }

    &-day {
      flex: 1;
      color: var(--color-text-main);
      font-size: 10px;
      text-align: center;
      opacity: 0.3;
    }
  }
</style>
