/**
 * Mock database: Releases
 *
 * Contains demo release data for projects
 */

import type { CommitData, ReleaseData, ReleaseDetails } from '@hawk.so/types';
import {
  MILLISECONDS_IN_SECOND,
  SECONDS_IN_DAY,
  ONE_DAY_AGO,
  ONE_WEEK_AGO,
  TWO_WEEKS_AGO,
  THREE_WEEKS_AGO
} from '@/utils/time';
import { DEMO_SECOND_PROJECT_ID } from './workspaces';

const NOW_SECONDS = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);

/**
 * Primary web demo release identifier
 */
export const DEMO_PRIMARY_RELEASE = 'v2.5.0';

/**
 * Mobile beta demo release identifier
 */
export const DEMO_MOBILE_RELEASE = 'mobile-2.8.0-beta.4';

/**
 * Commit shape returned by GraphQL Event.release.commits
 */
interface DemoReleaseCommit {
  hash: string;
  title: string;
  author: string;
  date: string;
}

/**
 * Converts unix timestamp in seconds to commit date string (GraphQL DateTime / worker format)
 *
 * @param timestampSeconds - Unix timestamp in seconds
 */
function toCommitDate(timestampSeconds: number): string {
  return new Date(timestampSeconds * MILLISECONDS_IN_SECOND).toUTCString();
}

/**
 * Normalizes commit to the exact fields CommitItem expects from API
 *
 * @param commit - raw demo commit
 */
function normalizeDemoCommit(commit: DemoReleaseCommit): DemoReleaseCommit {
  return {
    hash: commit.hash,
    title: commit.title,
    author: commit.author,
    date: commit.date,
  };
}

/**
 * Suspected commits for the primary demo release.
 * Matches production payload from release worker tests.
 */
export const DEMO_RELEASE_COMMITS: CommitData[] = [
  {
    hash: '599575d00e62924d08b031defe0a6b10133a75fc',
    title: 'Fix user hydration in account menu',
    author: 'geekan@codex.so',
    date: toCommitDate(NOW_SECONDS - SECONDS_IN_DAY) as unknown as Date,
  },
];

/**
 * Suspected commits for the mobile beta demo release
 */
export const DEMO_MOBILE_RELEASE_COMMITS: CommitData[] = [
  {
    hash: '7f3e9a2b1c0d4e8f6a5b4c3d2e1f0a9b8c7d6e5f4',
    title: 'Fix account hydration on beta shell mount',
    author: 'mobile@hawk.so',
    date: toCommitDate(NOW_SECONDS - SECONDS_IN_DAY) as unknown as Date,
  },
];

/**
 * Returns release name for demo project
 *
 * @param projectId - demo project id
 */
export function getDemoReleaseName(projectId?: string): string {
  return projectId === DEMO_SECOND_PROJECT_ID ? DEMO_MOBILE_RELEASE : DEMO_PRIMARY_RELEASE;
}

/**
 * Returns suspected commits for demo project release
 *
 * @param projectId - demo project id
 */
export function getDemoSuspectedCommits(projectId?: string): DemoReleaseCommit[] {
  const commits = projectId === DEMO_SECOND_PROJECT_ID
    ? DEMO_MOBILE_RELEASE_COMMITS
    : DEMO_RELEASE_COMMITS;

  return commits.map((commit) => normalizeDemoCommit({
    hash: commit.hash,
    title: commit.title,
    author: commit.author,
    date: typeof commit.date === 'string' ? commit.date : toCommitDate(NOW_SECONDS - SECONDS_IN_DAY),
  }));
}

/**
 * Release object attached to demo events (matches GraphQL Event.release)
 *
 * @param projectId - demo project id
 */
export function createDemoEventRelease(projectId?: string): {
  releaseName: string;
  commits: DemoReleaseCommit[];
} {
  return {
    releaseName: getDemoReleaseName(projectId),
    commits: getDemoSuspectedCommits(projectId),
  };
}

/**
 * Demo releases list
 */
export const DEMO_RELEASES: ReleaseData[] = [
  {
    release: DEMO_PRIMARY_RELEASE,
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * ONE_DAY_AGO,
    newEventsCount: 1480,
    commitsCount: 12,
    filesCount: 8,
  },
  {
    release: 'v2.4.1',
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * ONE_WEEK_AGO,
    newEventsCount: 760,
    commitsCount: 5,
    filesCount: 3,
  },
  {
    release: 'v2.4.0',
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * TWO_WEEKS_AGO,
    newEventsCount: 2140,
    commitsCount: 20,
    filesCount: 15,
  },
  {
    release: 'v2.3.2',
    timestamp: NOW_SECONDS - SECONDS_IN_DAY * THREE_WEEKS_AGO,
    newEventsCount: 320,
    commitsCount: 8,
    filesCount: 5,
  },
];

/**
 * Demo release details (for v2.5.0)
 */
export const DEMO_RELEASE_DETAILS: ReleaseDetails = {
  release: DEMO_PRIMARY_RELEASE,
  timestamp: NOW_SECONDS - SECONDS_IN_DAY * ONE_DAY_AGO,
  commits: getDemoSuspectedCommits() as unknown as CommitData[],
  files: [
    {
      mapFileName: 'processor.ts.map',
      originFileName: 'src/payment/processor.ts',
      length: 18432,
    },
    {
      mapFileName: 'package.json.map',
      originFileName: 'package.json',
      length: 2048,
    },
    {
      mapFileName: 'errorHandler.ts.map',
      originFileName: 'src/utils/errorHandler.ts',
      length: 9216,
    },
  ],
  newEventsCount: 1480,
};
