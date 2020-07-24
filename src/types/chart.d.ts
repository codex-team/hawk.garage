/**
 * This file describes interfaces used by different Charts
 */

/**
 * Represents a single item of Project Daily Events chart
 */
export interface ProjectChartItem extends ChartItem {
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
