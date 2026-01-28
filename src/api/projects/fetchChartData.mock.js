/**
 * Mock data for project overview chart
 */
const mockFetchChartData = {
  data: {
    project: {
      chartData: [
        {
          label: 'Events',
          data: [
            {
              timestamp: Date.now() - 6 * 86400000,
              count: 15,
            },
            {
              timestamp: Date.now() - 5 * 86400000,
              count: 22,
            },
            {
              timestamp: Date.now() - 4 * 86400000,
              count: 18,
            },
            {
              timestamp: Date.now() - 3 * 86400000,
              count: 25,
            },
            {
              timestamp: Date.now() - 2 * 86400000,
              count: 31,
            },
            {
              timestamp: Date.now() - 1 * 86400000,
              count: 28,
            },
            {
              timestamp: Date.now(),
              count: 35,
            },
          ],
        },
      ],
    },
  },
  errors: [],
};

export default mockFetchChartData;
