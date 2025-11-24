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
      <ChartLine
        v-for="(line, index) in lines"
        :key="`chart-line-${index}`"
        :points="line.data"
        :color="line.color"
        :chart-width="chartWidth"
        :chart-height="chartHeight"
        :min-value="minValue"
        :max-value="maxValue"
        :step-x="stepX"
        :label="line.label"
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
      v-if="hoveredIndex >= 0 && hoveredIndex < firstLineData.length"
      :style="{ transform: `translateX(${pointerLeft}px)` }"
      class="chart__pointer"
    >
      <div
        v-for="(line, index) in lines"
        :key="`cursor-${line.label}-${index}`"
        :style="{
          transform: `translateY(${getLinePointerTop(line.data)}px)`,
          backgroundColor: getCursorColor(line)
        }"
        class="chart__pointer-cursor"
        :class="`chart__pointer-cursor--${line.label}`"
      />
      <div
        class="chart__pointer-tooltip"
        :class="{
          'chart__pointer-tooltip--left': tooltipAlignment === 'left',
          'chart__pointer-tooltip--right': tooltipAlignment === 'right'
        }"
        :style="{ minWidth: `${(String(firstLineData[hoveredIndex].count).length + ' events'.length) * 6.4 + 12}px` }"
      >
        <div class="chart__pointer-tooltip-date">
          {{ formatTimestamp(firstLineData[hoveredIndex].timestamp * 1000) }}
        </div>
        <div
          v-for="(line, index) in lines"
          :key="`tooltip-line-${line.label}-${index}`"
          class="chart__pointer-tooltip-number"
        >
          <AnimatedCounter :value="(getLineValueAtHoveredIndex(line, hoveredIndex)) | spacedNumber" />
          {{ line.label }}
          <span
            class="chart__pointer-tooltip-dot"
            :style="{ backgroundColor: getCursorColor(line) }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { throttle } from '@/utils';
import { ChartItem, ChartLine as ChartLineInterface } from '../../types/chart';
import AnimatedCounter from './../utils/AnimatedCounter.vue';
import ChartLine, { type ChartLineColors, chartColors } from './ChartLine.vue';

type ChartData = {
  chartWidth: number;
  chartHeight: number;
  onResize: () => void;
  hoveredIndex: number;
};

export default Vue.extend({
  name: 'Chart',
  components: {
    AnimatedCounter,
    ChartLine,
  },
  props: {
    /**
     * List of lines for displaying on the chart
     */
    lines: {
      type: Array as () => ChartLineInterface[],
      default: () => [] as ChartLineInterface[],
    },

    /**
     * Detalization of the chart affects the legend and tooltip display
     */
    detalization: {
      type: String as () => 'minutes' | 'hours' | 'days',
      default: 'days',
    },
  },
  data(): ChartData {
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
        /**
         * noop placeholder, will be replaced in created lifecycle
         */
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

    firstLine(): ChartLineInterface {
      return this.lines[0];
    },

    firstLineData(): ChartItem[] {
      if (!this.firstLine) {
        return [];
      }

      return this.firstLine.data;
    },

    /**
     * Step for OX axis
     */
    stepX(): number {
      if (this.firstLineData.length <= 1) {
        return 0;
      }

      return this.chartWidth / (this.firstLineData.length - 1);
    },

    /**
     * Calculate the step for displaying x-legend items to prevent overflow
     * Returns how many items to skip between displayed items
     */
    visibleXLegendItems(): number {
      if (!this.chartWidth || !this.firstLineData.length) {
        return 1;
      }

      const maxItems = Math.floor(this.chartWidth / this.xLegendWidth);

      if (maxItems >= this.firstLineData.length) {
        return 1;
      }

      return Math.max(1, Math.ceil(this.firstLineData.length / maxItems));
    },

    /**
     * Filtered points to display in x-legend based on visibleXLegendItems step
     */
    visibleLegendPoints(): Array<{ point: ChartItem; index: number }> {
      const step = this.visibleXLegendItems;
      const result: Array<{ point: ChartItem; index: number }> = [];

      for (let i = 0; i < this.firstLineData.length; i = i + step) {
        result.push({
          point: this.firstLineData[i],
          index: i,
        });
      }

      /* Ensure the last point is always included */
      const lastIndex = this.firstLineData.length - 1;

      if (result.length > 0 && result[result.length - 1].index !== lastIndex) {
        result.push({
          point: this.firstLineData[lastIndex],
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
     * Minimum number errors per day across all lines
     */
    minValue(): number {
      if (this.lines.length === 0) {
        return 0;
      }

      /* Collect all count values from all lines */
      const allCounts: number[] = [];

      for (const line of this.lines) {
        if (line.data && line.data.length > 0) {
          allCounts.push(...line.data.map(item => item.count));
        }
      }

      if (allCounts.length === 0) {
        return 0;
      }

      return Math.min(...allCounts);
    },

    /**
     * Maximum number errors per day across all lines
     */
    maxValue(): number {
      if (this.lines.length === 0) {
        return 0;
      }

      /* Collect all count values from all lines */
      const allCounts: number[] = [];

      for (const line of this.lines) {
        if (line.data && line.data.length > 0) {
          allCounts.push(...line.data.map(item => item.count));
        }
      }

      if (allCounts.length === 0) {
        return 0;
      }

      /**
       * We will increment max value for 50% for adding some offset from the top
       */
      const incrementForOffset = 1.5;

      return Math.max(...allCounts) * incrementForOffset;
    },

    /**
     * Left coordinate of hover pointer
     */
    pointerLeft(): number {
      return this.hoveredIndex * this.stepX;
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

      if (!svg) {
        this.chartWidth = 0;
        this.chartHeight = 0;

        return;
      }

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
    moveTooltip(event: MouseEvent): void {
      if (this.firstLineData.length === 0) {
        this.hoveredIndex = -1;

        return;
      }

      if (this.stepX === 0) {
        this.hoveredIndex = -1;

        return;
      }

      const chartX = this.$el.getBoundingClientRect().left;
      const cursorX = event.clientX - chartX;

      const newIndex = Math.round(cursorX / this.stepX);
      const clampedIndex = Math.max(0, Math.min(this.firstLineData.length - 1, newIndex));

      this.hoveredIndex = clampedIndex;
    },

    /**
     * Get the Y coordinate for a line's pointer cursor at the hovered index
     *
     * @param {ChartItem[]} lineData - data points for the line
     * @param {number} lineIndex - index of the line
     * @returns {number} - Y coordinate for the cursor
     */
    getLinePointerTop(lineData: ChartItem[]): number {
      if (this.hoveredIndex === -1 || !lineData || lineData.length === 0) {
        return 0;
      }

      const point = lineData[this.hoveredIndex];

      if (!point) {
        return 0;
      }

      const currentValue = point.count ?? 0;

      return this.chartHeight - (currentValue - this.minValue) * this.kY;
    },

    /**
     * Get the value for a line at the hovered index
     *
     * @param {ChartLineInterface} line - the chart line
     * @param {number} index - hovered index
     * @returns {number} - the count value at that index
     */
    getLineValueAtHoveredIndex(line: ChartLineInterface, index: number): number {
      if (!line || !line.data || index < 0 || index >= line.data.length) {
        return 0;
      }

      const point = line.data[index];

      if (!point) {
        return 0;
      }

      return point.count || 0;
    },

    /**
     * Return colors set for a particular chart line
     *
     * @param {ChartLineInterface} line - the chart line
     */
    getLineColor(line: ChartLineInterface): ChartLineColors {
      const colorName = line.color ?? 'red';

      const color = chartColors.find(c => c.name === colorName);

      if (!color) {
        throw new Error(`Color ${colorName} not found in chartColors`);
      }

      return color;
    },

    /**
     * Cursor is a pointer on the chart line appearing when hovering over it
     *
     * @param {ChartLineInterface} line - the chart line
     */
    getCursorColor(line: ChartLineInterface): string {
      const color = this.getLineColor(line);

      return color.pointerColor;
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

    --legend-height: 40px;
    --legend-line-height: 11px;
    --legend-block-padding: 15px;

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
    }

    &__ox {
      height: var(--legend-height);
      padding-block: var(--legend-block-padding);

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
        line-height: var(--legend-line-height);
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
        width: 7px;
        height: 7px;
        margin-top: -3.5px;
        margin-left: -2px;
        border-radius: 50%;
        opacity: 1;
        /* transition: transform 0.2s; */
        will-change: transform;
      }

      &-tooltip {
        --tooltip-block-padding: 6px;

        position: absolute;
        top: calc(100% - var(--legend-height) + var(--legend-block-padding) - var(--tooltip-block-padding) - 1px);
        left: 50%;
        z-index: 500;
        padding-block: var(--tooltip-block-padding);
        padding-inline: 8px;
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

        &-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          vertical-align: middle;
          margin-left: 2px;
          margin-top: -1px;
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
