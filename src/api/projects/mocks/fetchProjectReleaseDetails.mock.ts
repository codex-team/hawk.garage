/**
 * Mock data for fetchProjectReleaseDetails
 * Returns detailed information about a specific release
 */

const releaseDetailsMock = {
  release: 'v2.5.0',
  timestamp: Date.now() - 86400000,
  commits: [
    {
      hash: 'abc123def',
      message: 'Fix critical bug in payment processing',
      author: 'Demo Developer',
      timestamp: Date.now() - 86400000,
    },
    {
      hash: 'def456ghi',
      message: 'Update dependencies',
      author: 'Demo Developer',
      timestamp: Date.now() - 86400000 - 3600000,
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
  ],
  newEventsCount: 3,
};

const mockFetchProjectReleaseDetails = {
  data: {
    project: {
      releaseDetails: releaseDetailsMock,
    },
  },
  errors: [],
};

export default mockFetchProjectReleaseDetails;
