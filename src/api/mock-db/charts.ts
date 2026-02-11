/**
 * Mock database: Charts
 *
 * Contains demo chart data for events and projects
 */

import type { ChartLine } from '@/types/chart';

const DAY = 86400;
const NOW = Math.floor(Date.now() / 1000);

/**
 * Demo chart data - used for both event and project charts
 */
export const DEMO_CHART_DATA: ChartLine[] = [
  {
    label: 'accepted',
    data: [
      {
        timestamp: NOW - 6 * DAY,
        count: 175,
      },
      {
        timestamp: NOW - 5 * DAY,
        count: 242,
      },
      {
        timestamp: NOW - 4 * DAY,
        count: 198,
      },
      {
        timestamp: NOW - 3 * DAY,
        count: 215,
      },
      {
        timestamp: NOW - 2 * DAY,
        count: 321,
      },
      {
        timestamp: NOW - 1 * DAY,
        count: 298,
      },
      {
        timestamp: NOW,
        count: 335,
      },
    ],
  },
  {
    label: 'rate-limited',
    data: [
      {
        timestamp: NOW - 6 * DAY,
        count: 105,
      },
      {
        timestamp: NOW - 5 * DAY,
        count: 122,
      },
      {
        timestamp: NOW - 4 * DAY,
        count: 18,
      },
      {
        timestamp: NOW - 3 * DAY,
        count: 2500,
      },
      {
        timestamp: NOW - 2 * DAY,
        count: 31,
      },
      {
        timestamp: NOW - 1 * DAY,
        count: 128,
      },
      {
        timestamp: NOW,
        count: 135,
      },
    ],
  },
];
