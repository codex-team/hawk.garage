<template>
  <div
    class="chart"
    @mousemove.passive="moveTooltip"
    @mouseleave.passive="hoveredIndex = -1"
  >
    <div
      v-if="points.length > 1"
      class="chart__info"
    >
      <span class="chart__info-today"> today </span>
      <span class="chart__info-highlight"> {{ todayCount | spacedNumber }} </span>

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
        :stroke="maxValue === minValue ? 'rgba(61, 133, 210, 0.22)' : 'url(#chart)'"
        stroke-width="2"
        :points="polylinePoints"
      />
    </svg>
    <div
      class="chart__ox"
    >
      <div
        class="chart__ox-inner"
        :style="{
          margin: `0 ${stepX / 2}px`
        }"
      >
        <span
          v-for="(day, index) in points"
          :key="index"
          class="chart__ox-item"
        >
          {{ day.timestamp * 1000 | prettyDateFromTimestamp }}
        </span>
      </div>
    </div>
    <div
      v-if="hoveredIndex > 0 && hoveredIndex < points.length - 1"
      :style="`left: ${pointerLeft}px;`"
      class="chart__pointer"
    >
      <div
        :style="`top: ${pointerTop}px`"
        class="chart__pointer-cursor"
      />
      <div
        class="chart__pointer-tooltip"
        :style="`min-width: ${(String(points[hoveredIndex].count).length + ' events'.length) * 6.4 + 12}px`"
      >
        <div class="chart__pointer-tooltip-date">
          {{ points[hoveredIndex].timestamp * 1000 | prettyDateFromTimestamp }}
        </div>
        <div class="chart__pointer-tooltip-number">
          <AnimatedCounter :value="points[hoveredIndex].count | spacedNumber" />
          events
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from '@/utils';
import { ChartItem } from '../../types/chart';
import AnimatedCounter from './../utils/AnimatedCounter.vue';

export default Vue.extend({
  name: 'Chart',
  components: {
    AnimatedCounter,
  },
  props: {
    /**
     * List of points for displaying on the chart
     */
    points: {
      type: Array as () => ChartItem[],
      default: () => [] as ChartItem[],
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
       * Handler of window resize
       */
      onResize: (): void => {
        // do nothing
      },

      /**
       * Hovered point index
       */
      hoveredIndex: -1,
    };
  },
  computed: {
    /**
     * Step for OX axis
     */
    stepX(): number {
      return this.chartWidth / (this.points.length - 1);
    },

    /**
     * The ratio of the maximum value and the height of the graph
     */
    kY(): number {
      if (this.maxValue === this.minValue) {
        return 1;
      }

      return (this.chartHeight) / (this.maxValue - this.minValue);
    },

    /**
     * Number of errors for the current day
     */
    todayCount(): number {
      return this.points.slice(-1)[0].count || 0;
    },

    /**
     * Number of errors for the previous day
     */
    yesterdayCount(): number {
      return this.points.slice(-2, -1)[0].count || 0;
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
      return Math.min(...this.points.map(day => day.count));
    },

    /**
     * Maximum number errors per day
     */
    maxValue(): number {
      /**
       * We will increment max value for 20% for adding some offset from the top
       */
      const incrementForOffset = 1.2;

      return Math.max(...this.points.map(day => day.count)) * incrementForOffset;
    },

    /**
     * Left coordinate of hover pointer
     */
    pointerLeft(): number {
      return this.hoveredIndex * this.stepX;
    },

    /**
     * Top coordinate of hover pointer cursor
     */
    pointerTop(): number {
      if (this.hoveredIndex === -1) {
        return 0;
      }

      const currentValue = this.points[this.hoveredIndex].count;

      return this.chartHeight - currentValue * this.kY;
    },

    /**
     * Points for SVG <polyline>
     */
    polylinePoints(): string {
      if (!this.points || !this.points.length) {
        return '';
      }

      const points : string[] = [];

      this.points.forEach((day, index) => {
        const value = day.count;
        const pointX = index * this.stepX;
        const pointY = this.chartHeight - value * this.kY;

        points.push(pointX + ' ' + pointY);
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
      const svg = this.$refs.chart as SVGElement;

      this.chartWidth = svg.clientWidth;
      this.chartHeight = svg.clientHeight - strokeWidth;
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
    },
  },
});
</script>
<style>
  .chart {
    position: relative;
    z-index: 0;
    display: flex;
    flex-direction: column;
    height: 215px;
    background-color: var(--color-bg-darken);
    border-radius: 3px;

    &__info {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 5px 10px ;
      color: var(--color-text-main);
      font-size: 13px;
      white-space: nowrap;
      background: color-mod(var(--color-bg-main) alpha(50%));
      border-radius: 5px;

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
        shape-rendering: geometricPrecision;
      }
    }

    &__ox {
      height: 40px;
      padding: 15px 0;

      &-inner {
        display: flex;
        justify-content: space-between;
      }

      &-item {
        flex: 1;
        color: var(--color-text-main);
        font-size: 10px;
        text-align: center;
        opacity: 0.3;

        &:first-of-type,
        &:last-of-type {
          display: none;
        }
      }
    }

    &__pointer {
      position: absolute;
      top: 0;
      z-index: 0;
      width: 3px;
      height: 100%;
      margin-left: -1.5px;
      background-color: rgba(25, 28, 37, 0.5);
      transition: left 0.2s cubic-bezier(.53,.04,.57,1.22);
      animation: pointer-in 200ms ease;
      will-change: opacity, left;

      &-cursor {
        position: absolute;
        width: 5px;
        height: 5px;
        margin-top: -2.5px;
        margin-left: -1px;
        background: var(--color-indicator-critical);
        border-radius: 50%;
        opacity: 1;
        transition: 0.2s;
        will-change: top;
      }

      &-tooltip {
        position: absolute;
        bottom: -10px;
        left: -20px;
        z-index: 500;
        margin-left: -2px;
        padding: 6px 8px 6px 7px;
        color: var(--color-text-main);
        font-size: 12px;
        line-height: 1.4;
        letter-spacing: 0.2px;
        white-space: nowrap;
        background: #191C25;
        border-radius: 4px;
        box-shadow: 0 7px 12px 0 rgba(0, 0, 0, 0.12);
        transition: min-width 150ms ease;

        &-date {
          color: var(--color-text-second);
          font-size: 10px;
        }

        &-number {
          font-weight: 500;
        }
      }
    }
  }

  @keyframes pointer-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
