/**
 * Mock database: Releases
 *
 * Contains demo release data for projects
 */

import type { ReleaseData, ReleaseDetails } from '@/types/project-integrations';
import {
  MILLISECONDS_IN_SECOND,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_DAY,
  ONE_DAY_AGO,
  TWO_DAYS_AGO,
  ONE_WEEK_AGO,
  TWO_WEEKS_AGO,
  THREE_WEEKS_AGO
} from '@/utils/time';

const DAY = MILLISECONDS_IN_DAY;
const NOW = Date.now();
const TWO_HOURS = MILLISECONDS_IN_HOUR * 2;

/**
 * Demo releases list
 */
export const DEMO_RELEASES: ReleaseData[] = [
  {
    release: 'v2.5.0',
    timestamp: NOW - DAY * ONE_DAY_AGO,
    newEventsCount: 3,
    commitsCount: 12,
    filesCount: 8,
  },
  {
    release: 'v2.4.1',
    timestamp: NOW - DAY * ONE_WEEK_AGO,
    newEventsCount: 1,
    commitsCount: 5,
    filesCount: 3,
  },
  {
    release: 'v2.4.0',
    timestamp: NOW - DAY * TWO_WEEKS_AGO,
    newEventsCount: 2,
    commitsCount: 20,
    filesCount: 15,
  },
  {
    release: 'v2.3.2',
    timestamp: NOW - DAY * THREE_WEEKS_AGO,
    newEventsCount: 0,
    commitsCount: 8,
    filesCount: 5,
  },
];

/**
 * Demo release details (for v2.5.0)
 */
export const DEMO_RELEASE_DETAILS: ReleaseDetails = {
  release: 'v2.5.0',
  timestamp: NOW - DAY * ONE_DAY_AGO,
  commits: [
    {
      hash: 'abc123def',
      message: 'Fix critical bug in payment processing',
      author: 'Demo Developer',
      timestamp: NOW - DAY,
    },
    {
      hash: 'def456ghi',
      message: 'Update dependencies',
      author: 'Demo Developer',
      timestamp: NOW - DAY - MILLISECONDS_IN_HOUR,
    },
    {
      hash: 'ghi789jkl',
      message: 'Improve error handling',
      author: 'Demo Developer',
      timestamp: NOW - DAY - TWO_HOURS,
    },
  ],
  files: [
    {
      path: 'src/payment/processor.ts',
      additions: 15,
      deletions: 8,
    },
    {
      path: 'package.json',
      additions: 3,
      deletions: 3,
    },
    {
      path: 'src/utils/errorHandler.ts',
      additions: 22,
      deletions: 5,
    },
  ],
  newEventsCount: 3,
};
