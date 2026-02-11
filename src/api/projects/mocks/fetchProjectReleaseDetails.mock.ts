import { DEMO_RELEASE_DETAILS } from '@/api/mock-db';

/**
 * Mock: fetchProjectReleaseDetails
 *
 * Returns detailed release information from mock-db
 */
export default function mockFetchProjectReleaseDetails() {
  return {
    data: {
      project: {
        releaseDetails: DEMO_RELEASE_DETAILS,
      },
    },
    errors: [],
  };
}
