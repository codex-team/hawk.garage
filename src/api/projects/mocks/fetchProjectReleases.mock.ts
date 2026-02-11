import { DEMO_RELEASES } from '@/api/mock-db';

/**
 * Mock: fetchProjectReleases
 *
 * Returns list of releases from mock-db
 */
export default function mockFetchProjectReleases() {
  return {
    data: {
      project: {
        releases: DEMO_RELEASES,
      },
    },
    errors: [],
  };
}
