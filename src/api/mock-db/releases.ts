/**
 * Mock database: Releases
 *
 * Contains demo release data for projects
 */

import type { ReleaseData, ReleaseDetails } from '@hawk.so/types';
import {
  MILLISECONDS_IN_SECOND,
  SECONDS_IN_HOUR,
  SECONDS_IN_DAY,
  ONE_DAY_AGO,
  ONE_WEEK_AGO,
  TWO_WEEKS_AGO,
  THREE_WEEKS_AGO
} from '@/utils/time';

const NOW_SECONDS = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
const TWO_HOURS_SECONDS = SECONDS_IN_HOUR * 2;

/**
 * Demo releases list
 */
export const DEMO_RELEASES: ReleaseData[] = [
  {
    release: 'v2.5.0',
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * ONE_DAY_AGO,
    newEventsCount: 3,
    commitsCount: 12,
    filesCount: 8,
  },
  {
    release: 'v2.4.1',
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * ONE_WEEK_AGO,
    newEventsCount: 1,
    commitsCount: 5,
    filesCount: 3,
  },
  {
    release: 'v2.4.0',
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * TWO_WEEKS_AGO,
    newEventsCount: 2,
    commitsCount: 20,
    filesCount: 15,
  },
  {
    release: 'v2.3.2',
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * THREE_WEEKS_AGO,
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
  timestamp: NOW_SECONDS - SECONDS_IN_DAY * ONE_DAY_AGO,
  commits: [
    {
      hash: 'abc123def',
      message: 'Fix critical bug in payment processing',
      author: 'Demo Developer',
      timestamp: NOW_SECONDS - SECONDS_IN_DAY,
    },
    {
      hash: 'def456ghi',
      message: 'Update dependencies',
      author: 'Demo Developer',
      timestamp: NOW_SECONDS - SECONDS_IN_DAY - SECONDS_IN_HOUR,
    },
    {
      hash: 'ghi789jkl',
      message: 'Improve error handling',
      author: 'Demo Developer',
      timestamp: NOW_SECONDS - SECONDS_IN_DAY - TWO_HOURS_SECONDS,
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
