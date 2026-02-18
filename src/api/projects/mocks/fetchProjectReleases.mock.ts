import { DEMO_RELEASES } from '@/api/mock-db';
import type { ReleaseData } from '@hawk.so/types';

/**
 * Mock: fetchProjectReleases
 *
 * Returns list of releases from mock-db
 */
export default function mockFetchProjectReleases(): ReleaseData[] {
  return DEMO_RELEASES;
}
