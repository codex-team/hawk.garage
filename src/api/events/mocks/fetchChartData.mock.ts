import { DEMO_CHART_DATA } from '@/api/mock-db';
import type { ChartLine } from '@/types/chart';

/**
 * Mock: fetchChartData (events)
 *
 * Returns chart data from mock-db
 */
export default function mockFetchChartData(): ChartLine[] {
  return DEMO_CHART_DATA;
}
