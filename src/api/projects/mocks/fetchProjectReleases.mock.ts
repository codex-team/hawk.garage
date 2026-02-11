/**
 * Mock data for fetchProjectReleases
 * Returns a list of releases with event counts
 */

const releasesMock = [
  {
    release: 'v2.5.0',
    timestamp: Date.now() - 86400000, // 1 day ago
    newEventsCount: 3,
    commitsCount: 12,
    filesCount: 8,
  },
  {
    release: 'v2.4.1',
    timestamp: Date.now() - 86400000 * 7, // 1 week ago
    newEventsCount: 1,
    commitsCount: 5,
    filesCount: 3,
  },
  {
    release: 'v2.4.0',
    timestamp: Date.now() - 86400000 * 14, // 2 weeks ago
    newEventsCount: 2,
    commitsCount: 20,
    filesCount: 15,
  },
];

const mockFetchProjectReleases = {
  data: {
    project: {
      releases: releasesMock,
    },
  },
  errors: [],
};

export default mockFetchProjectReleases;
