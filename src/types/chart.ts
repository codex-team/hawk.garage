/**
 * This file describes interfaces used by different Charts
 */

/**
 * Represents a single item of Project Daily Events chart
 */
export interface ProjectChartItem extends ChartItem {
}

/**
 * Represents a single item of Event Daily chart
 */
export interface EventChartItem extends ChartItem {
}

/**
 * Chart element in common case
 */
export interface ChartItem {
  /**
   * Day midnight
   */
  timestamp: number;

  /**
   * How many events occurred in that day
   */
  count: number;
}

/**
 * Chart line with label and data points
 */
export interface ChartLine {
  /**
   * Series label (e.g., "accepted", "rate-limited")
   */
  label: string;

  /**
   * Data points for the series
   */
  data: ChartItem[];

  /**
   * Name of the color for the line stroke and fill.
   */
  color?: ChartLineColor;
}

/**
 * Name of the color for the chart line stroke and fill.
 */
export enum ChartLineColor {
  /**
   * Accent color for primary line
   */
  Red = 'red',

  /**
   * Accent color for secondary line
   */
  LightGrey = 'light-grey'
}
