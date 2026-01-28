/**
 * Mock data for fetchProjectReleases
 */
const mockFetchProjectReleases = {
  data: {
    project: {
      releases: [
        {
          id: 'release-rel-001',
          release: 'v1.2.3',
          version: '1.2.3',
          created: new Date('2026-01-28'),
          description: 'Latest stable release with bug fixes and performance improvements',
          eventGroupingPatterns: [],
          commits: 24,
          filesChanged: 156,
          insertions: 2841,
          deletions: 1205,
          author: 'John Developer',
        },
        {
          id: 'release-rel-002',
          release: 'v1.2.2',
          version: '1.2.2',
          created: new Date('2026-01-21'),
          description: 'Hotfix release - critical security patches',
          eventGroupingPatterns: [],
          commits: 5,
          filesChanged: 8,
          insertions: 142,
          deletions: 89,
          author: 'Sarah Team Lead',
        },
        {
          id: 'release-rel-003',
          release: 'v1.2.1',
          version: '1.2.1',
          created: new Date('2026-01-14'),
          description: 'Minor release - new features and improvements',
          eventGroupingPatterns: [],
          commits: 38,
          filesChanged: 203,
          insertions: 4156,
          deletions: 1876,
          author: 'John Developer',
        },
        {
          id: 'release-rel-004',
          release: 'v1.2.0',
          version: '1.2.0',
          created: new Date('2026-01-07'),
          description: 'Major release - new API endpoints and database schema',
          eventGroupingPatterns: [],
          commits: 87,
          filesChanged: 451,
          insertions: 12456,
          deletions: 5643,
          author: 'Sarah Team Lead',
        },
      ],
    },
  },
  errors: [],
};

export default mockFetchProjectReleases;
