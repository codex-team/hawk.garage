import { DEMO_CHART_DATA } from '@/api/mock-db';
import type { ChartLine } from '@/types/chart';

/**
 * Mock: fetchChartData (projects)
 *
 * Returns chart data for project overview from mock-db
 */
export default function mockFetchChartData(): {
  data: { project: { chartData: ChartLine[] } };
  errors: unknown[];
} {
  return {
    data: {
      project: {
        chartData: DEMO_CHART_DATA,
      },
    },
    errors: [],
  };
}
