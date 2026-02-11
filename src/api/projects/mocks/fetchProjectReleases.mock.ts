import { DEMO_RELEASES } from '@/api/mock-db';
import type { ReleaseData } from '@/types/project-integrations';

/**
 * Mock: fetchProjectReleases
 *
 * Returns list of releases from mock-db
 */
export default function mockFetchProjectReleases(): {
  data: { project: { releases: ReleaseData[] } };
  errors: unknown[];
} {
  return {
    data: {
      project: {
        releases: DEMO_RELEASES,
      },
    },
    errors: [],
  };
}
