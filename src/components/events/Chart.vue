<template>
  <div
    class="chart"
    @mousemove.passive="moveTooltip"
    @mouseleave.passive="hoveredIndex = -1"
  >
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
            style="stop-color:#FF2E51;"
          />
          <stop
            offset="100%"
            style="stop-color:#424565;"
          />
        </linearGradient>
        <linearGradient
          id="chartFill"
          gradientTransform="rotate(90)"
        >
          <stop
            offset="0%"
            style="stop-color:rgba(255, 46, 81, 0.3);"
          />
          <stop
            offset="100%"
            style="stop-color:rgba(66, 69, 101, 0);"
          />
        </linearGradient>
      </defs>
      <path
        class="chart__body-path-fill"
        :fill="maxValue === minValue ? 'rgba(61, 133, 210, 0.05)' : 'url(#chartFill)'"
        :d="smoothPathFill"
      />
      <path
        class="chart__body-path"
        fill="none"
        :stroke="maxValue === minValue ? 'rgba(61, 133, 210, 0.22)' : 'url(#chart)'"
        stroke-width="3"
        :d="smoothPath"
      />
    </svg>
    <div
      class="chart__ox"
    >
      <div
        class="chart__ox-inner"
      >
        <span
          v-for="item in visibleLegendPoints"
          :key="item.index"
          class="chart__ox-item"
          :style="{ left: `${item.index * stepX}px`, transform: 'translateX(-50%)' }"
        >
          {{ formatTimestamp(item.point.timestamp * 1000) }}
        </span>
      </div>
    </div>
    <div
      v-if="hoveredIndex >= 0 && hoveredIndex < points.length"
      :style="{ transform: `translateX(${pointerLeft}px)` }"
      class="chart__pointer"
    >
      <div
        :style="{ transform: `translateY(${pointerTop}px)` }"
        class="chart__pointer-cursor"
      />
      <div
        class="chart__pointer-tooltip"
        :class="{
          'chart__pointer-tooltip--left': tooltipAlignment === 'left',
          'chart__pointer-tooltip--right': tooltipAlignment === 'right'
        }"
        :style="{ minWidth: `${(String(points[hoveredIndex].count).length + ' events'.length) * 6.4 + 12}px` }"
      >
        <div class="chart__pointer-tooltip-date">
          {{ formatTimestamp(points[hoveredIndex].timestamp * 1000) }}
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

import { throttle } from '@/utils';
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

    /**
     * Detalization of the chart affects the legend and tooltip display
     */
    detalization: {
      type: String as () => 'minutes' | 'hours' | 'days',
      default: 'days',
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
     * Width of x-legend item
     */
    xLegendWidth(): number {
      switch (this.detalization) {
        case 'days':
          return 50;
        case 'hours':
          return 75;
        case 'minutes':
          return 90;
        default:
          return 55;
      }
    },

    /**
     * Step for OX axis
     */
    stepX(): number {
      return this.chartWidth / (this.points.length - 1);
    },

    /**
     * Calculate the step for displaying x-legend items to prevent overflow
     * Returns how many items to skip between displayed items
     */
    visibleXLegendItems(): number {
      if (!this.chartWidth || !this.points.length) {
        return 1;
      }

      const maxItems = Math.floor(this.chartWidth / this.xLegendWidth);

      if (maxItems >= this.points.length) {
        return 1;
      }

      return Math.max(1, Math.ceil(this.points.length / maxItems));
    },

    /**
     * Filtered points to display in x-legend based on visibleXLegendItems step
     */
    visibleLegendPoints(): Array<{ point: ChartItem; index: number }> {
      const step = this.visibleXLegendItems;
      const result: Array<{ point: ChartItem; index: number }> = [];

      for (let i = 0; i < this.points.length; i = i + step) {
        result.push({
          point: this.points[i],
          index: i,
        });
      }

      /* Ensure the last point is always included */
      const lastIndex = this.points.length - 1;

      if (result.length > 0 && result[result.length - 1].index !== lastIndex) {
        result.push({
          point: this.points[lastIndex],
          index: lastIndex,
        });
      }

      return result;
    },

    /**
     * The ratio of the maximum value and the height of the graph
     */
    kY(): number {
      if (this.maxValue === this.minValue) {
        return 1;
      }

      return this.chartHeight / (this.maxValue - this.minValue);
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
       * We will increment max value for 50% for adding some offset from the top
       */
      const incrementForOffset = 1.5;

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

      return this.chartHeight - (currentValue - this.minValue) * this.kY;
    },

    /**
     * Tooltip alignment class based on position to prevent overflow
     */
    tooltipAlignment(): string {
      const estimatedTooltipWidth = 100;
      const pointerX = this.hoveredIndex * this.stepX;

      if (pointerX < estimatedTooltipWidth / 2) {
        /* Near left edge - align tooltip to the left */
        return 'left';
      } else if (pointerX > this.chartWidth - estimatedTooltipWidth / 2) {
        /* Near right edge - align tooltip to the right */
        return 'right';
      }

      /* Default center alignment */
      return 'center';
    },

    /**
     * Smooth path using cubic Bezier curves for SVG <path>
     */
    smoothPath(): string {
      if (!this.points || !this.points.length) {
        return '';
      }

      if (this.points.length === 1) {
        const pointX = 0;
        const pointY = this.chartHeight - (this.points[0].count - this.minValue) * this.kY;

        return `M ${pointX} ${pointY}`;
      }

      const pathPoints: Array<{ x: number; y: number }> = [];

      this.points.forEach((day, index) => {
        const value = day.count;
        const pointX = index * this.stepX;
        const pointY = this.chartHeight - (value - this.minValue) * this.kY;

        pathPoints.push({ x: pointX,
          y: pointY });
      });

      /* Start with move to first point */
      let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;

      /* Vertical margins to prevent curve from going outside chart area */
      const verticalMargin = 2;
      const minY = verticalMargin;
      const maxY = this.chartHeight - verticalMargin;

      /* Generate smooth curves between points */
      for (let i = 0; i < pathPoints.length - 1; i++) {
        const p0 = i > 0 ? pathPoints[i - 1] : pathPoints[i];
        const p1 = pathPoints[i];
        const p2 = pathPoints[i + 1];
        const p3 = i < pathPoints.length - 2 ? pathPoints[i + 2] : p2;

        /* Check if both points in segment are at minimum (zero or near zero) */
        const v1 = this.points[i].count;
        const v2 = this.points[i + 1].count;
        const isFlat = v1 === this.minValue && v2 === this.minValue;

        if (isFlat) {
          /* Use linear interpolation for flat segments at minimum value */
          path += ` L ${p2.x} ${p2.y}`;
        } else {
          /* Calculate control points for cubic Bezier curve */
          const cp1x = p1.x + (p2.x - p0.x) / 6;
          let cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          let cp2y = p2.y - (p3.y - p1.y) / 6;

          /* Clamp control points to stay within chart bounds */
          cp1y = Math.max(minY, Math.min(maxY, cp1y));
          cp2y = Math.max(minY, Math.min(maxY, cp2y));

          /* Add cubic Bezier curve segment */
          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
      }

      return path;
    },

    /**
     * Smooth path with closed area for gradient fill
     */
    smoothPathFill(): string {
      if (!this.points || !this.points.length) {
        return '';
      }

      const path = this.smoothPath;

      if (!path) {
        return '';
      }

      if (this.points.length === 1) {
        const pointX = 0;
        const pointY = this.chartHeight - (this.points[0].count - this.minValue) * this.kY;

        /* Close the path: line to bottom right, line to bottom left, close */
        return `M ${pointX} ${pointY} L ${pointX} ${this.chartHeight} L ${pointX} ${this.chartHeight} Z`;
      }

      /* Get the last point coordinates from the path */
      const lastIndex = this.points.length - 1;
      const lastX = lastIndex * this.stepX;
      const firstX = 0;

      /* Close the path: line to bottom right, line to bottom left, close back to start */
      return `${path} L ${lastX} ${this.chartHeight} L ${firstX} ${this.chartHeight} Z`;
    },
  },
  created() {
    this.onResize = throttle(this.windowResized, 200);
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

    /**
     * Formats timestamp based on detalization prop
     *
     * @param {number} timestamp - timestamp in milliseconds
     * @returns {string} - formatted date string
     */
    formatTimestamp(timestamp: number): string {
      const date = new Date(timestamp);

      if (this.detalization === 'days') {
        /* For days, show only day and month */
        const day = date.getDate();
        const month = date.getMonth();

        return `${day} ${this.$t('common.shortMonths[' + month + ']')}`;
      } else {
        /* For hours and minutes, show day, month, hours:minutes */
        const day = date.getDate();
        const month = date.getMonth();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');

        return `${day} ${this.$t('common.shortMonths[' + month + ']')}, ${paddedHours}:${paddedMinutes}`;
      }
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
    }

    &__body {
      flex-grow: 2;

      &-path-fill {
        stroke: none;
        vector-effect: non-scaling-stroke;
        shape-rendering: geometricPrecision;
      }

      &-path {
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
        position: relative;
        width: 100%;
        height: 100%;
      }

      &-item {
        position: absolute;
        left: 0;
        color: var(--color-text-main);
        font-size: 11px;
        text-align: center;
        transform-origin: center;
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
      left: 0;
      z-index: 0;
      width: 3px;
      height: 100%;
      margin-left: -1.5px;
      background-color: rgba(25, 28, 37, 0.5);
      /* transition: transform 0.1s cubic-bezier(.53,.04,.57,1.22); */
      animation: pointer-in 200ms ease;
      will-change: opacity, transform;

      &-cursor {
        position: absolute;
        top: 0;
        width: 5px;
        height: 5px;
        margin-top: -2.5px;
        margin-left: -1px;
        background: var(--color-indicator-critical);
        border-radius: 50%;
        opacity: 1;
        /* transition: transform 0.2s; */
        will-change: transform;
      }

      &-tooltip {
        position: absolute;
        bottom: -14px;
        left: 50%;
        z-index: 500;
        padding: 6px 8px 6px 7px;
        color: var(--color-text-main);
        font-size: 12px;
        line-height: 1.4;
        letter-spacing: 0.2px;
        white-space: nowrap;
        text-align: center;
        background: #191C25;
        border-radius: 7px;
        box-shadow: 0 7px 12px 0 rgba(0, 0, 0, 0.12);
        transform: translateX(-50%);
        transition: min-width 150ms ease;

        &--left {
          left: 0;
          transform: translateX(0);
        }

        &--right {
          right: 0;
          left: auto;
          transform: translateX(0);
        }

        &-date {
          margin-bottom: 2px;
          color: var(--color-text-second);
          font-size: 11px;
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
