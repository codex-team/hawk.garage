import { DEMO_CHART_DATA } from '@/api/mock-db';

/**
 * Mock: fetchChartData (projects)
 *
 * Returns chart data for project overview from mock-db
 */
export default function mockFetchChartData() {
  return {
    data: {
      project: {
        chartData: DEMO_CHART_DATA,
      },
    },
    errors: [],
  };
}
