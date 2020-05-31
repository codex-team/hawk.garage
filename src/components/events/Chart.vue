<template>
  <div
    class="chart"
    @mousemove.passive="moveTooltip"
  >
    <div
      v-if="days.length > 1"
      class="chart__info"
    >
      <span class="chart__info-today"> today </span>
      <span class="chart__info-highlight"> {{ todayCount }} </span>

      <span
        v-if="difference !== 0"
        :class="{
          'chart__info-increase': difference > 0,
          'chart__info-decrease': difference < 0
        }"
      >
        {{ Math.abs(difference) | spacedNumber }}
      </span>
    </div>
    <svg
      ref="chart"
      class="chart__body"
    >
      <defs>
        <linearGradient
          id="chart"
          gradientTransform="rotate(90)"
        >
          <stop
            offset="0%"
            style="stop-color:#ff4c4c;"
          />
          <stop
            offset="100%"
            style="stop-color:rgba(61, 133, 210, 0.22);"
          />
        </linearGradient>
      </defs>
      <polyline
        class="chart__body-polyline"
        fill="none"
        stroke="url(#chart)"
        stroke-width="2.5"
        :points="polylinePoints"
      />
    </svg>
    <div
      class="chart__oy"
      :style="{
        margin: `0 -${stepX / 2}px`
      }"
    >
      <span
        v-for="(day, index) in days"
        :key="index"
        class="chart__oy-item"
      >
        {{ day.timestamp * 1000 | prettyDateFromTimestamp }}
      </span>
    </div>
    <div
      :style="`left: ${pointerLeft}px`"
      class="chart__pointer"
    >
      <div
        :style="`top: ${pointerTop}px`"
        class="chart__pointer-cursor"
      />
      <div
        v-if="hoveredIndex !== 0 && hoveredIndex !== days.length - 1"
        class="chart__pointer-tooltip"
      >
        <div class="chart__pointer-tooltip-date">
          {{ days[hoveredIndex].timestamp * 1000 | prettyDateFromTimestamp }}
        </div>
        <div class="chart__pointer-tooltip-number">
          {{ numberOfEvents }} events
        </div>
      </div>
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
       * Chart SVG clientWidth
       */
      chartWidth: 0,

      /**
       * Chart SVG clientWidth
       */
      chartHeight: 0,


      /**
       * Event on window resize
       *
       * @returns {void}
       */
      onResize: () => {},
      pointsY: [] as number[],
      numberOfEvents: 67,

      /**
       * Hovered point index
       */
      hoveredIndex: 0,
    };
  },
  computed: {
    /**
     * Step for OX axis
     */
    stepX(): number {
      return this.chartWidth / (this.days.length - 1);
    },

    /**
     * The ratio of the maximum value and the height of the graph
     */
    kY(): number {
      return (this.chartHeight) / (this.maxValue - this.minValue);
    },

    /**
     * Number of errors for the current day
     */
    todayCount(): number {
      return this.days.slice(-1)[0].count || 0;
    },

    /**
     * Number of errors for the previous day
     */
    yesterdayCount(): number {
      return this.days.slice(-2, -1)[0].count || 0;
    },

    /**
     * Difference between current and previous number of errors
     */
    difference(): number {
      return this.todayCount - this.yesterdayCount;
    },

    /**
     * Minimum number errors per day
     */
    minValue(): number {
      return Math.min(...this.days.map(day => day.count));
    },

    /**
     * Maximum number errors per day
     */
    maxValue(): number {
      /**
       * We will increment max value for 20% for adding some offset from the top
       */
      const incrementForOffset = 1.2;

      return Math.max(...this.days.map(day => day.count)) * incrementForOffset;
    },

    /**
     * Left coordinate of hover pointer
     */
    pointerLeft(): number {
      return this.hoveredIndex * this.stepX - 1.5;
    },

    /**
     * Top coordinate of hover pointer cursor
     */
    pointerTop(): number {
      return 152.5 - this.pointsY[this.hoveredIndex];
    },

    /**
     * Points for SVG <polyline>
     */
    polylinePoints(): string {
      if (!this.days || !this.days.length){
        return '';
      }

      const points : string[] = [];

      this.days.forEach((day, index) => {
        const value = day.count;
        const pointX = index * this.stepX;
        const pointY = this.chartHeight - value * this.kY;

        points.push(pointX + ' ' + pointY);

        this.pointsY.push(pointY);
      });

      return points.join(', ');
    },
  },
  created() {
    this.onResize = debounce(this.windowResized, 200);
  },
  mounted() {
    /**
     * Cache wrapper width
     */
    this.computeWrapperSize();

    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    /**
     * Compute and save chart wrapper width
     */
    computeWrapperSize(): void {
      const strokeWidth = 2;

      this.chartWidth = this.$refs['chart'].clientWidth;
      this.chartHeight = this.$refs['chart'].clientHeight - strokeWidth;
    },

    /**
     * Handler for window resize
     */
    windowResized(): void {
      this.computeWrapperSize();
    },

    /**
     * Moves tooltip to the hovered point
     *
     * @param {MouseEvent} event - mousemove
     */
    moveTooltip(event): void {
      const chartX = this.$el.getBoundingClientRect().left;
      const cursorX = event.clientX - chartX;

      this.hoveredIndex = Math.round(cursorX / this.stepX);

      this.numberOfEvents = this.days[this.hoveredIndex].count;
    },
  },
});
</script>
<style>
  .chart {
    position: relative;
    height: 215px;
    background-color: var(--color-bg-main);
    z-index: 0;
    display: flex;
    flex-direction: column;

    &__info {
      position: absolute;
      right: 15px;
      top: 15px;
      background: rgba(36, 182, 255, 0.13);
      padding: 5px 10px ;
      border-radius: 5px;
      color: var(--color-text-main);
      font-size: 13px;
      white-space: nowrap;

      &-today {
        color: var(--color-text-second);
      }

      &-highlight {
        margin-left: 6px;
        font-weight: bold;
      }

      &-increase,
      &-decrease {
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

      &-increase::before,
      &-decrease::before {
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

    &__body {
      flex-grow: 2;

      polyline {
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
      }
    }

    &__oy {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      height: 40px;

      &-item {
        flex: 1;
        color: var(--color-text-main);
        font-size: 10px;
        opacity: 0.3;
        text-align: center;

        &:first-of-type,
        &:last-of-type {
          opacity: 0;
        }
      }
    }

    &__pointer {
      transition: 0.2s;
      position: absolute;
      width: 3px;
      height: 100%;
      top: 0;
      background-color: #1e212b;
      z-index: 0;

      &-curor {
        position: absolute;
        width: 5px;
        height: 5px;
        background: #d94848;
        border-radius: 50%;
        opacity: 1;
        margin-left: -1px;
        transition: 0.2s;
      }

      &-tooltip {
        position: absolute;
        bottom: -10px;
        white-space: nowrap;
        color: #fff;
        font-size: 12px;
        letter-spacing: 0.2px;
        left: -20px;
        border-radius: 4px;
        box-shadow: 0 7px 12px 0 rgba(0, 0, 0, 0.12);
        padding: 6px 8px 6px 7px;
        background: #191c25;
        line-height: 1.4;
        z-index: 500;

        &-date {
          font-size: 10px;
          color: var(--color-text-second);
        }
      }
    }
  }
</style>
