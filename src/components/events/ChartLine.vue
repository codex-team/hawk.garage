<template>
  <g :data-label="label">
    <defs>
      <linearGradient
        :id="gradientId"
        gradientTransform="rotate(90)"
      >
        <stop
          offset="0%"
          :style="{ 'stop-color': colorSet.strokeStart }"
        />
        <stop
          offset="100%"
          :style="`stop-color:${colorSet.strokeEnd};`"
        />
      </linearGradient>
      <linearGradient
        :id="fillGradientId"
        gradientTransform="rotate(90)"
      >
        <stop
          offset="0%"
          :style="`stop-color:${colorSet.fillStart};`"
        />
        <stop
          offset="100%"
          :style="`stop-color:${colorSet.fillEnd};`"
        />
      </linearGradient>
    </defs>
    <path
      class="chart__body-path-fill"
      :fill="`url(#${fillGradientId})`"
      :d="smoothPathFill"
    />
    <path
      class="chart__body-path"
      fill="none"
      :stroke="`url(#${gradientId})`"
      stroke-width="3"
      :d="smoothPath"
    />
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import { ChartItem, ChartLineColor } from '../../types/chart';

/**
 * A particular color params
 */
export interface ChartLineColors {
  /**
   * Name of the color
   */
  name: ChartLineColor;
  /**
   * Starting color for stroke gradient (top)
   */
  strokeStart: string;
  /**
   * Ending color for stroke gradient (bottom)
   */
  strokeEnd: string;
  /**
   * Starting color for fill gradient (top, with opacity)
   */
  fillStart: string;
  /**
   * Ending color for fill gradient (bottom, usually transparent)
   */
  fillEnd: string;

  /**
   * Pointer + legend color
   */
  pointerColor: string;
}

/**
 * Colors set for several chart lines
 */
export const chartColors: ChartLineColors[] = [
  {
    name: ChartLineColor.LightGrey,
    strokeStart: 'rgba(75, 90, 121, 0.33)',
    strokeEnd: 'rgba(71, 72, 85, 0.16)',
    fillStart: 'rgba(63, 136, 255, 0.01)',
    fillEnd: 'rgba(66, 78, 93, 0.05)',
    pointerColor: '#717289',
  },
  {
    name: ChartLineColor.Red,
    strokeStart: '#FF2E51',
    strokeEnd: '#424565',
    fillStart: 'rgba(255, 46, 81, 0.3)',
    fillEnd: 'rgba(66, 69, 101, 0)',
    pointerColor: '#FF2E51',
  },
];

export default Vue.extend({
  name: 'ChartLine',
  props: {
    /**
     * List of points for displaying on the chart
     */
    points: {
      type: Array as () => ChartItem[],
      default: () => [] as ChartItem[],
    },

    /**
     * Label for the chart line
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Name of the color for the chart line
     */
    color: {
      type: String as () => ChartLineColor,
      default: ChartLineColor.Red,
    },

    /**
     * Chart SVG clientWidth
     */
    chartWidth: {
      type: Number,
      default: 0,
    },

    /**
     * Chart SVG clientHeight
     */
    chartHeight: {
      type: Number,
      default: 0,
    },

    /**
     * Minimum value for scaling
     */
    minValue: {
      type: Number,
      default: 0,
    },

    /**
     * Maximum value for scaling
     */
    maxValue: {
      type: Number,
      default: 0,
    },

    /**
     * Step for OX axis
     */
    stepX: {
      type: Number,
      default: 0,
    },
  },
  data() {
    /**
     * Unique ID for gradient definitions to avoid conflicts when multiple ChartLine components are used
     */
    const gradientId = `chart-gradient-${Math.random().toString(36).substr(2, 9)}`;
    const fillGradientId = `chart-fill-gradient-${Math.random().toString(36).substr(2, 9)}`;

    return {
      gradientId,
      fillGradientId,
    };
  },
  computed: {
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

    /**
     * Color for the chart line
     */
    colorSet(): ChartLineColors {
      return chartColors.find(c => c.name === this.color) as ChartLineColors;
    },
  },
});
</script>

<style>
.chart__body-path-fill {
  stroke: none;
  vector-effect: non-scaling-stroke;
  shape-rendering: geometricPrecision;
}

.chart__body-path {
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  shape-rendering: geometricPrecision;
}
</style>
