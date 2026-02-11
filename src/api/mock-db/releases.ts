/**
 * Mock database: Releases
 *
 * Contains demo release data for projects
 */

/**
 * Release data type
 */
interface Release {
  release: string;
  timestamp: number;
  newEventsCount: number;
  commitsCount: number;
  filesCount: number;
}

interface ReleaseDetails {
  release: string;
  timestamp: number;
  commits: Array<{
    hash: string;
    message: string;
    author: string;
    timestamp: number;
  }>;
  files: Array<{
    path: string;
    additions: number;
    deletions: number;
  }>;
  newEventsCount: number;
}

const DAY = 86400000; // 1 day in milliseconds
const NOW = Date.now();

/**
 * Demo releases list
 */
export const DEMO_RELEASES: Release[] = [
  {
    release: 'v2.5.0',
    timestamp: NOW - DAY,
    newEventsCount: 3,
    commitsCount: 12,
    filesCount: 8,
  },
  {
    release: 'v2.4.1',
    timestamp: NOW - DAY * 7,
    newEventsCount: 1,
    commitsCount: 5,
    filesCount: 3,
  },
  {
    release: 'v2.4.0',
    timestamp: NOW - DAY * 14,
    newEventsCount: 2,
    commitsCount: 20,
    filesCount: 15,
  },
  {
    release: 'v2.3.2',
    timestamp: NOW - DAY * 21,
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
  timestamp: NOW - DAY,
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
      timestamp: NOW - DAY - 3600000,
    },
    {
      hash: 'ghi789jkl',
      message: 'Improve error handling',
      author: 'Demo Developer',
      timestamp: NOW - DAY - 7200000,
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
