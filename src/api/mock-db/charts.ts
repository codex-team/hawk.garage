/**
 * Mock database: Charts
 *
 * Contains demo chart data for events and projects
 */

import type { ChartLine } from '@hawk.so/types';
import {
  MILLISECONDS_IN_SECOND,
  SECONDS_IN_DAY,
  SIX_DAYS_AGO,
  FIVE_DAYS_AGO,
  FOUR_DAYS_AGO,
  THREE_DAYS_AGO,
  TWO_DAYS_AGO,
  ONE_DAY_AGO
} from '@/utils/time';

const DAY = SECONDS_IN_DAY;
const NOW = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);

/**
 * Demo chart data - used for both event and project charts
 */
export const DEMO_CHART_DATA: ChartLine[] = [
  {
    label: 'accepted',
    data: [
      {
        timestamp: NOW - SIX_DAYS_AGO * DAY,
        count: 175,
      },
      {
        timestamp: NOW - FIVE_DAYS_AGO * DAY,
        count: 242,
      },
      {
        timestamp: NOW - FOUR_DAYS_AGO * DAY,
        count: 198,
      },
      {
        timestamp: NOW - THREE_DAYS_AGO * DAY,
        count: 215,
      },
      {
        timestamp: NOW - TWO_DAYS_AGO * DAY,
        count: 321,
      },
      {
        timestamp: NOW - ONE_DAY_AGO * DAY,
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
        timestamp: NOW - SIX_DAYS_AGO * DAY,
        count: 105,
      },
      {
        timestamp: NOW - FIVE_DAYS_AGO * DAY,
        count: 122,
      },
      {
        timestamp: NOW - FOUR_DAYS_AGO * DAY,
        count: 18,
      },
      {
        timestamp: NOW - THREE_DAYS_AGO * DAY,
        count: 2500,
      },
      {
        timestamp: NOW - TWO_DAYS_AGO * DAY,
        count: 31,
      },
      {
        timestamp: NOW - ONE_DAY_AGO * DAY,
        count: 128,
      },
      {
        timestamp: NOW,
        count: 135,
      },
    ],
  },
];
