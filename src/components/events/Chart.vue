<template>
  <div class="project-overview__chart">
    <div class="project-overview__chart-info">
      <span class="project-overview__chart-info__today"> today </span>
      <span class="project-overview__chart-info__highlight"> {{ todayCount | spacedNumber }} </span>
      <span
        v-if="difference > 0"
        class="project-overview__chart-info-increase"
      >
        {{ difference | spacedNumber }}
      </span>
      <span
        v-else-if="difference < 0"
        class="project-overview__chart-info-decrease"
      >
        {{ -difference | spacedNumber }}
      </span>
      <span
        v-else
        class="project-overview__chart-info-equal"
      >
        {{ difference | spacedNumber }}
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
        stroke="url(#chart)"
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

export default Vue.extend({
  name: 'Chart',
  data() {
    return {
      /**
       * List of days with the number of errors per day
       * @type {any[]}
       */
      days: [
        { timestamp: 1581943395219, totalCount: 500 },
        { timestamp: 1582029795219, totalCount: 800 },
        { timestamp: 1582116195219, totalCount: 100 },
        { timestamp: 1582202595219, totalCount: 50 },
        { timestamp: 1582288995219, totalCount: 25 },
        { timestamp: 1582375395219, totalCount: 75 },
        { timestamp: 1582461795219, totalCount: 25 },
        { timestamp: 1582548195219, totalCount: 1000 },
        { timestamp: 1582634595219, totalCount: 900 },
        { timestamp: 1582720995219, totalCount: 850 },
        { timestamp: 1582807395219, totalCount: 900 },
        { timestamp: 1582893795219, totalCount: 150 },
        { timestamp: 1582980195219, totalCount: 300 },
        { timestamp: 1583066595219, totalCount: 400 },
        { timestamp: 1583152995219, totalCount: 650 },
        { timestamp: 1583239395219, totalCount: 750 },
      ] as any[],

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
      return this.days.slice(-1)[0].totalCount;
    },

    /**
     * Number of errors for the previous day
     *
     * @return {number}
     */
    yesterdayCount(): number {
      return this.days.slice(-2, -1)[0].totalCount;
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
     */
    createPolyline() {
      const step = this.$el.clientWidth / (this.days.length - 1);
      const points : string[] = [];

      this.days.forEach((day, index) => {
        const pointX = index * step;
        const pointY = 2 + (day.totalCount - this.minCount) / (this.maxCount - this.minCount) * 100;

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
      padding: 15px 0 20px 0;
      min-width: 100px;
      float: right;
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

      &-increase, &-decrease, &-equal {
        position: relative;
        font-size: 13px;
        font-weight: bold;
        color: #f15454;
        margin-left: 32px;
        padding-right: 15px;
      }

      &-increase {
        color: #f15454;
      }

      &-decrease {
        color: #2ccf6c;
      }

      &-increase::before, &-decrease::before, &-equal::before {
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
