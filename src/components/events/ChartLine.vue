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

<script setup lang="ts">
import { chartColors } from '@/constants/charts';
import { computed } from 'vue';
import { ChartItem, ChartLineColor, type ChartLineColors } from '../../types/chart';



interface Props {
  /**
   * List of points for displaying on the chart
   */
  points?: ChartItem[];

  /**
   * Label for the chart line
   */
  label?: string;

  /**
   * Name of the color for the chart line
   */
  color?: ChartLineColor;

  /**
   * Chart SVG clientWidth
   */
  chartWidth?: number;

  /**
   * Chart SVG clientHeight
   */
  chartHeight?: number;

  /**
   * Minimum value for scaling
   */
  minValue?: number;

  /**
   * Maximum value for scaling
   */
  maxValue?: number;

  /**
   * Step for OX axis
   */
  stepX?: number;
}

const props = withDefaults(defineProps<Props>(), {
  points: () => [] as ChartItem[],
  label: '',
  color: ChartLineColor.Red,
  chartWidth: 0,
  chartHeight: 0,
  minValue: 0,
  maxValue: 0,
  stepX: 0,
});

/**
 * Unique ID for gradient definitions to avoid conflicts when multiple ChartLine components are used
 */
const gradientId = `chart-gradient-${Math.random()
  .toString(36)
  .substring(2, 9)}`;
const fillGradientId = `chart-fill-gradient-${Math.random()
  .toString(36)
  .substring(2, 9)}`;

/**
 * The ratio of the maximum value and the height of the graph
 */
const kY = computed((): number => {
  if (props.maxValue === props.minValue) {
    return 1;
  }

  return props.chartHeight / (props.maxValue - props.minValue);
});

/**
 * Smooth path using cubic Bezier curves for SVG <path>
 */
const smoothPath = computed((): string => {
  if (!props.points || !props.points.length) {
    return '';
  }

  if (props.points.length === 1) {
    const pointX = 0;
    const pointY = props.chartHeight - (props.points[0].count - props.minValue) * kY.value;

    return `M ${pointX} ${pointY}`;
  }

  const pathPoints: Array<{
    x: number;
    y: number;
  }> = [];

  props.points.forEach((day, index) => {
    const value = day.count;
    const pointX = index * props.stepX;
    const pointY = props.chartHeight - (value - props.minValue) * kY.value;

    pathPoints.push({ x: pointX, y: pointY });
  });

  /* Start with move to first point */
  let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;

  /* Vertical margins to prevent curve from going outside chart area */
  const verticalMargin = 2;
  const minY = verticalMargin;
  const maxY = props.chartHeight - verticalMargin;

  /* Generate smooth curves between points */
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const p0 = i > 0 ? pathPoints[i - 1] : pathPoints[i];
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];
    const p3 = i < pathPoints.length - 2 ? pathPoints[i + 2] : p2;

    /* Check if both points in segment are at minimum (zero or near zero) */
    const v1 = props.points[i].count;
    const v2 = props.points[i + 1].count;
    const isFlat = v1 === props.minValue && v2 === props.minValue;

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
});

/**
 * Smooth path with closed area for gradient fill
 */
const smoothPathFill = computed((): string => {
  if (!props.points || !props.points.length) {
    return '';
  }

  const path = smoothPath.value;

  if (!path) {
    return '';
  }

  if (props.points.length === 1) {
    const pointX = 0;
    const pointY = props.chartHeight - (props.points[0].count - props.minValue) * kY.value;

    /* Close the path: line to bottom right, line to bottom left, close */
    return `M ${pointX} ${pointY} L ${pointX} ${props.chartHeight} L ${pointX} ${props.chartHeight} Z`;
  }

  /* Get the last point coordinates from the path */
  const lastIndex = props.points.length - 1;
  const lastX = lastIndex * props.stepX;
  const firstX = 0;

  /* Close the path: line to bottom right, line to bottom left, close back to start */
  return `${path} L ${lastX} ${props.chartHeight} L ${firstX} ${props.chartHeight} Z`;
});

/**
 * Color for the chart line
 */
const colorSet = computed((): ChartLineColors => {
  return chartColors.find(c => c.name === props.color) as ChartLineColors;
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
