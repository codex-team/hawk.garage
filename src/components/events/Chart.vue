<template>
  <div class="project-overview__chart">
    <div
      v-if="days.length > 1"
      class="project-overview__chart-info"
    >
      <span class="project-overview__chart-info__today"> today </span>
      <span class="project-overview__chart-info__highlight"> {{ todayCount }} </span>

      <span
        v-if="difference != 0"
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
        :stroke="this.minCount != this.maxCount ? 'url(#chart)' : 'rgba(61, 133, 210, 0.22)'"
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
        {{ day.timestamp | prettyDateFromTimestamp }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from '@/utils';
import { ChartData } from '../../store/modules/events/index';

export default Vue.extend({
  name: 'Chart',
  props: {
    /**
     * List of days with the number of errors per day
     * @type {ChartData[]}
     */
    days: {
      type: Array as () => ChartData[],
      default: () => [] as ChartData[],
    },
  },
  data() {
    return {
      /**
       * points for svg polyline
       * @type {string}
       */
      polylinePoints: '' as string,

      /**
       * Event on window resize
       *
       * @return {void}
       */
      onResize: () => {},
    };
  },
  computed: {
    /**
     * Number of errors for the current day
     *
     * @return {number}
     */
    todayCount(): number {
      return this.days.slice(-1)[0].totalCount || 0;
    },

    /**
     * Number of errors for the previous day
     *
     * @return {number}
     */
    yesterdayCount(): number {
      return this.days.slice(-2, -1)[0].totalCount || 0;
    },

    /**
     * Difference between current and previous number of errors
     *
     * @return {number}
     */
    difference(): number {
      return this.todayCount - this.yesterdayCount;
    },

    /**
     * Days used in chart
     *
     * @return {number}
     */
    visibleDays(): any[] {
      return this.days.slice(1, -1);
    },

    /**
     * Minimum number errors per day
     *
     * @return {number}
     */
    minCount(): number {
      return Math.min(...this.days.map(day => day.totalCount));
    },

    /**
     * Maximum number errors per day
     *
     * @return {number}
     */
    maxCount(): number {
      return Math.max(...this.days.map(day => day.totalCount));
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
          pointY += (day.totalCount - this.minCount) / (this.maxCount - this.minCount) * 100;
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
    height: 215px;
    margin: 16px 15px 0;
    background-color: var(--color-bg-main);
    position: relative;

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
        font-size: 13px;
        font-weight: bold;
        color: #f15454;
        margin-left: 32px;
      }

      &-increase {
        color: #f15454;
      }

      &-decrease {
        color: #2ccf6c;
      }

      &-increase::before, &-decrease::before {
        content: '';
        position: absolute;
        left: -18px;
        top: 4px;
        border: 5.5px solid transparent;
        border-top: 9px solid #2ccf6c;
      }

      &-increase::before {
        border-top-color: #f15454;;
        transform: rotate(180deg) translateY(7px);
      }
    }

    &-body {
      transform: scale(1, -1);
      width: 100%;
      height: 105px;
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
      text-align: center;
      opacity: 0.3;
      font-size: 10px;
      flex: 1;
      color: var(--color-text-main);
    }
  }
</style>