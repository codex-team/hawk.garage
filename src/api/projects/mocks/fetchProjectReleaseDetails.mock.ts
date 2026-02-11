import { DEMO_RELEASE_DETAILS } from '@/api/mock-db';
import type { ReleaseDetails } from '@/types/project-integrations';

/**
 * Mock: fetchProjectReleaseDetails
 *
 * Returns detailed release information from mock-db
 */
export default function mockFetchProjectReleaseDetails(): {
  data: { project: { releaseDetails: ReleaseDetails } };
  errors: unknown[];
} {
  return {
    data: {
      project: {
        releaseDetails: DEMO_RELEASE_DETAILS,
      },
    },
    errors: [],
  };
}
