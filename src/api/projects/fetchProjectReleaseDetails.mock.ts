/**
 * Mock data for fetchProjectReleaseDetails
 */
const mockFetchProjectReleaseDetails = {
  data: {
    project: {
      releaseDetails: {
        id: 'release-rel-001',
        release: 'v1.2.3',
        version: '1.2.3',
        created: new Date('2026-01-28'),
        description: 'Latest stable release with bug fixes and performance improvements',
        commits: 24,
        filesChanged: 156,
        insertions: 2841,
        deletions: 1205,
        author: 'John Developer',
        authorEmail: 'dev@example.com',
        changelog: `
## v1.2.3 - 2026-01-28

### New Features
- Added event filtering by browser type
- Implemented real-time notifications for critical errors
- New dashboard widget for error trends

### Bug Fixes
- Fixed crash when loading events without timezone data
- Resolved memory leak in event storage
- Fixed typo in notification templates

### Performance
- Optimized database queries for large datasets
- Reduced bundle size by 15%
- Improved chart rendering performance

### Breaking Changes
- Removed deprecated API endpoints from v1.1.x
- Updated minimum Node.js version to 18.0.0

### Contributors
- John Developer (@johndev)
- Sarah Team Lead (@sarahteam)
- Alex Frontend (@alexfrontend)
        `,
        eventGroupingPatterns: [
          {
            id: 'pattern-001',
            regexp: 'TypeError.*Cannot read.*undefined',
            template: '[TypeError] Cannot read property',
          },
          {
            id: 'pattern-002',
            regexp: 'ReferenceError.*is not defined',
            template: '[ReferenceError] Variable not defined',
          },
          {
            id: 'pattern-003',
            regexp: 'SyntaxError.*Unexpected token',
            template: '[SyntaxError] Parser error',
          },
          {
            id: 'pattern-004',
            regexp: 'NetworkError.*Failed to fetch',
            template: '[NetworkError] Request failed',
          },
        ],
      },
    },
  },
  errors: [],
};

export default mockFetchProjectReleaseDetails;
