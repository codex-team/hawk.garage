import type { ChartLineColor } from '@/types/chart';

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
