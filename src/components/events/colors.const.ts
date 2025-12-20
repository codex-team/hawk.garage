import { ChartLineColor } from '@/types/chart';
import type { ChartLineColors } from './types.chart';

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
