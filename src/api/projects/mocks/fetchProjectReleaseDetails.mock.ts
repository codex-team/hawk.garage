import { DEMO_RELEASE_DETAILS } from '@/api/mock-db';
import type { ReleaseDetails } from '@hawk.so/types';

/**
 * Mock: fetchProjectReleaseDetails
 *
 * Returns detailed release information from mock-db
 */
export default function mockFetchProjectReleaseDetails(): ReleaseDetails {
  return DEMO_RELEASE_DETAILS;
}
