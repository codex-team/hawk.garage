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
        :min-value="getLineMinValue(line)"
        :max-value="getLineMaxValue(line)"
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
      <template
        v-for="(line, index) in lines"
      >
        <div
          v-if="!isLineAllZeros(line)"
          :key="`cursor-${line.label}-${index}`"
          :style="{
            transform: `translateY(${getLinePointerTop(line)}px)`,
            backgroundColor: getCursorColor(line)
          }"
          class="chart__pointer-cursor"
          :class="`chart__pointer-cursor--${line.label}`"
        />
      </template>
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
        <template
          v-for="(line, index) in lines"
        >
          <div
            v-if="!isLineAllZeros(line)"
            :key="`tooltip-line-${line.label}-${index}`"
            class="chart__pointer-tooltip-number"
          >
            <AnimatedCounter :value="formatSpacedNumber(getLineValueAtHoveredIndex(line, hoveredIndex))" />
            {{ line.label }}
            <span
              class="chart__pointer-tooltip-dot"
              :style="{ backgroundColor: getCursorColor(line) }"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chartColors } from '@/constants/charts';
import { throttle } from '@/utils';
import { prettyDateFromTimestamp, spacedNumber } from '@/utils/filters';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChartItem, type ChartLineColors, ChartLine as ChartLineInterface } from '../../types/chart';
import AnimatedCounter from './../utils/AnimatedCounter.vue';
import ChartLine from './ChartLine.vue';

interface Props {
  /**
   * List of lines for displaying on the chart
   */
  lines?: ChartLineInterface[];

  /**
   * Detalization of the chart affects the legend and tooltip display
   */
  detalization?: 'minutes' | 'hours' | 'days';
}

const props = withDefaults(defineProps<Props>(), {
  lines: () => [] as ChartLineInterface[],
  detalization: 'days',
});

const { t } = useI18n();

/**
 * Chart SVG clientWidth
 */
const chartWidth = ref(0);

/**
 * Chart SVG clientWidth
 */
const chartHeight = ref(0);

/**
 * Hovered point index
 */
const hoveredIndex = ref(-1);

/**
 * Chart SVG element ref
 */
const chart = ref<SVGElement | null>(null);

/**
 * Width of x-legend item
 */
const xLegendWidth = computed((): number => {
  switch (props.detalization) {
    case 'days':
      return 50;
    case 'hours':
      return 75;
    case 'minutes':
      return 90;
    default:
      return 55;
  }
});

/**
 * First line of the chart.
 * Used for calculating stepX
 */
const firstLine = computed((): ChartLineInterface => {
  return props.lines[0];
});

/**
 * Data of the first line of the chart.
 * Used for calculating stepX (and other common properties across all lines)
 */
const firstLineData = computed((): ChartItem[] => {
  if (!firstLine.value) {
    return [];
  }

  return firstLine.value.data;
});

/**
 * Step for OX axis
 */
const stepX = computed((): number => {
  if (firstLineData.value.length <= 1) {
    return 0;
  }

  return chartWidth.value / (firstLineData.value.length - 1);
});

/**
 * Calculate the step for displaying x-legend items to prevent overflow
 * Returns how many items to skip between displayed items
 */
const visibleXLegendItems = computed((): number => {
  if (!chartWidth.value || !firstLineData.value.length) {
    return 1;
  }

  const maxItems = Math.floor(chartWidth.value / xLegendWidth.value);

  if (maxItems >= firstLineData.value.length) {
    return 1;
  }

  return Math.max(1, Math.ceil(firstLineData.value.length / maxItems));
});

/**
 * Filtered points to display in x-legend based on visibleXLegendItems step
 */
const visibleLegendPoints = computed((): Array<{
  point: ChartItem;
  index: number;
}> => {
  const step = visibleXLegendItems.value;
  const result: Array<{
    point: ChartItem;
    index: number;
  }> = [];

  for (let i = 0; i < firstLineData.value.length; i = i + step) {
    result.push({
      point: firstLineData.value[i],
      index: i,
    });
  }

  /* Ensure the last point is always included */
  const lastIndex = firstLineData.value.length - 1;

  if (result.length > 0 && result[result.length - 1].index !== lastIndex) {
    result.push({
      point: firstLineData.value[lastIndex],
      index: lastIndex,
    });
  }

  return result;
});

/**
 * Left coordinate of hover pointer
 */
const pointerLeft = computed((): number => {
  return hoveredIndex.value * stepX.value;
});

/**
 * Tooltip alignment class based on position to prevent overflow
 */
const tooltipAlignment = computed((): string => {
  const estimatedTooltipWidth = 100;
  const pointerX = hoveredIndex.value * stepX.value;

  if (pointerX < estimatedTooltipWidth / 2) {
    /* Near left edge - align tooltip to the left */
    return 'left';
  } else if (pointerX > chartWidth.value - estimatedTooltipWidth / 2) {
    /* Near right edge - align tooltip to the right */
    return 'right';
  }

  /* Default center alignment */
  return 'center';
});

/**
 * Computed property that returns formatted today count with spaces
 */
const formattedTodayCount = computed((): string => {
  return spacedNumber((props as any).todayCount);
});

/**
 * Computed property that returns formatted difference with spaces
 */
const formattedDifference = computed((): string => {
  return spacedNumber(Math.abs((props as any).difference));
});

/**
 * Computed property that returns a function to format count by index
 */
const formatCountByIndex = computed(() => {
  return (index: number) => {
    return spacedNumber((props as any).points[index]?.count || 0);
  };
});

/**
 * Computed property that returns a function to format date by index
 */
const formatDateByIndex = computed(() => {
  return (index: number) => {
    return prettyDateFromTimestamp((props as any).points[index]?.timestamp * 1000 || 0);
  };
});

/**
 * Computed property that returns array of formatted dates for all points
 */
const formattedDates = computed((): string[] => {
  return ((props as any).points || []).map((day: any) => prettyDateFromTimestamp(day.timestamp * 1000));
});

/**
 * Compute and save chart wrapper width
 */
function computeWrapperSize(): void {
  const strokeWidth = 2;
  const svg = chart.value as SVGElement;

  if (!svg) {
    chartWidth.value = 0;
    chartHeight.value = 0;

    return;
  }

  chartWidth.value = svg.clientWidth;
  chartHeight.value = svg.clientHeight - strokeWidth;
}

/**
 * Handler for window resize
 */
function windowResized(): void {
  computeWrapperSize();
}

/**
 * Handler of window resize
 */
const onResize = throttle(windowResized, 200);

/**
 * Moves tooltip to the hovered point
 *
 * @param event - mousemove
 */
function moveTooltip(event: MouseEvent): void {
  if (firstLineData.value.length === 0) {
    hoveredIndex.value = -1;

    return;
  }

  if (stepX.value === 0) {
    hoveredIndex.value = -1;

    return;
  }

  const chartX = (event.currentTarget as HTMLElement).getBoundingClientRect().left;
  const cursorX = event.clientX - chartX;

  const newIndex = Math.round(cursorX / stepX.value);
  const clampedIndex = Math.max(0, Math.min(firstLineData.value.length - 1, newIndex));

  hoveredIndex.value = clampedIndex;
}

/**
 * Get the Y coordinate for a line's pointer cursor at the hovered index
 *
 * @param line - the chart line
 * @returns Y coordinate for the cursor
 */
function getLinePointerTop(line: ChartLineInterface): number {
  if (hoveredIndex.value === -1 || !line || !line.data || line.data.length === 0) {
    return 0;
  }

  const point = line.data[hoveredIndex.value];

  if (!point) {
    return 0;
  }

  const lineMinValue = getLineMinValue(line);
  const lineMaxValue = getLineMaxValue(line);
  const lineKY = lineMaxValue === lineMinValue
    ? 1
    : chartHeight.value / (lineMaxValue - lineMinValue);

  const currentValue = point.count ?? 0;

  return chartHeight.value - (currentValue - lineMinValue) * lineKY;
}

/**
 * Get the value for a line at the hovered index
 *
 * @param line - the chart line
 * @param index - hovered index
 * @returns the count value at that index
 */
function getLineValueAtHoveredIndex(line: ChartLineInterface, index: number): number {
  if (!line || !line.data || index < 0 || index >= line.data.length) {
    return 0;
  }

  const point = line.data[index];

  if (!point) {
    return 0;
  }

  return point.count || 0;
}

/**
 * Return colors set for a particular chart line
 *
 * @param line - the chart line
 */
function getLineColor(line: ChartLineInterface): ChartLineColors {
  const colorName = line.color ?? 'red';

  const color = chartColors.find(c => c.name === colorName);

  if (!color) {
    throw new Error(`Color ${colorName} not found in chartColors`);
  }

  return color;
}

/**
 * Cursor is a pointer on the chart line appearing when hovering over it
 *
 * @param line - the chart line
 */
function getCursorColor(line: ChartLineInterface): string {
  const color = getLineColor(line);

  return color.pointerColor;
}

/**
 * Get minimum value for a specific line
 *
 * @param line - the chart line
 * @returns minimum value for the line
 */
function getLineMinValue(line: ChartLineInterface): number {
  if (!line || !line.data || line.data.length === 0) {
    return 0;
  }

  let min = Infinity;

  for (const item of line.data) {
    if (item.count < min) {
      min = item.count;
    }
  }

  return min === Infinity ? 0 : min;
}

/**
 * Check if all data counters of a line are 0
 *
 * @param line - the chart line
 * @returns true if all values are 0, false otherwise
 */
function isLineAllZeros(line: ChartLineInterface): boolean {
  if (!line || !line.data || line.data.length === 0) {
    return true;
  }

  for (const item of line.data) {
    if (item.count !== 0) {
      return false;
    }
  }

  return true;
}

/**
 * Get maximum value for a specific line
 *
 * @param line - the chart line
 * @returns maximum value for the line (with 50% offset)
 */
function getLineMaxValue(line: ChartLineInterface): number {
  if (!line || !line.data || line.data.length === 0) {
    return 0;
  }

  let max = 0;

  for (const item of line.data) {
    if (item.count > max) {
      max = item.count;
    }
  }

  /**
   * We will increment max value for 50% for adding some offset from the top
   */
  const incrementForOffset = 1.5;

  return max * incrementForOffset;
}

/**
 * Formats timestamp based on detalization prop
 *
 * @param timestamp - timestamp in milliseconds
 * @returns formatted date string
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  if (props.detalization === 'days') {
    /* For days, show only day and month */
    const day = date.getDate();
    const month = date.getMonth();

    return `${day} ${t('common.shortMonths[' + month + ']')}`;
  } else {
    /* For hours and minutes, show day, month, hours:minutes */
    const day = date.getDate();
    const month = date.getMonth();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${day} ${t('common.shortMonths[' + month + ']')}, ${paddedHours}:${paddedMinutes}`;
  }
}

/**
 * Formats number with spaces
 *
 * @param value - number value
 * @returns formatted number
 */
function formatSpacedNumber(value: number): string {
  return spacedNumber(value);
}

onMounted(() => {
  /**
   * Cache wrapper width
   */
  computeWrapperSize();

  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
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
