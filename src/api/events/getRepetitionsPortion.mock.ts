import type { HawkEvent } from '@/types/events';
import { DEMO_USER } from '@/api/user/demoUser.mock';

/**
 * Helper to create detailed mock repetition events
 */
const createRepetitionEvent = (
  id: string,
  originalId: string,
  title: string,
  type: string,
  groupHash: string,
  timestamp: number,
  count: number,
  browser: string,
  os: string
): HawkEvent => ({
  id,
  groupHash,
  totalCount: count,
  visitedBy: [DEMO_USER],
  marks: {
    resolved: false,
    starred: false,
    ignored: false,
  },
  payload: {
    title: title,
    type: type,
    backtrace: [
      {
        file: 'src/store/modules/user.ts',
        line: 42,
        column: 15,
        function: 'getUserProfile',
        arguments: ['userId'],
        sourceCode: [
          { line: 40, content: 'export const getUserProfile = (userId) => {' },
          { line: 41, content: '  const user = state.users[userId];' },
          { line: 42, content: '  return user.profile.settings;' },
          { line: 43, content: '};' },
        ],
      },
      {
        file: 'src/components/UserPanel.vue',
        line: 28,
        column: 8,
        function: 'mounted',
        arguments: [],
        sourceCode: [
          { line: 26, content: 'mounted() {' },
          { line: 27, content: '  this.profile = getUserProfile(this.userId);' },
          { line: 28, content: '  console.log(this.profile.email);' },
          { line: 29, content: '}' },
        ],
      },
    ],
    get: {
      userId: 'user-123',
      profileId: 'profile-456',
    },
    post: {
      action: 'loadUserProfile',
      timestamp,
    },
    headers: {
      'User-Agent': browser,
      'Accept': 'application/json',
      'X-Request-ID': id,
    },
    release: 'v1.2.3',
    user: {
      id: 'user-demo-001',
    } as any,
    context: {
      browser,
      os,
      screen: browser.includes('Safari') && os.includes('iOS') ? '390x844' : '1920x1080',
      timezone: 'UTC+2',
      language: 'en-US',
      url: 'http://localhost:8080/project/6215743cf3ff6b80215cb183',
    },
    addons: {} as any,
  },
  catcherType: 'client/javascript',
  repetitions: [],
  usersAffected: 1,
  assignee: undefined as any,
  timestamp,
  originalTimestamp: timestamp - 86400000,
  originalEventId: originalId,
});

/**
 * Mock data for getRepetitionsPortion - past occurrences of the same error
 */
const mockGetRepetitionsPortion = {
  data: {
    project: {
      event: {
        repetitionsPortion: {
          repetitions: [
            createRepetitionEvent(
              '507f1f77bcf86cd799439014',
              '507f1f77bcf86cd799439010',
              'TypeError: Cannot read property \'user\' of undefined',
              'TypeError',
              'hash-507f1f77bcf86cd799439011',
              Date.now(),
              42,
              'Chrome 120.0.0 (Windows NT 10.0; Win64; x64)',
              'Windows 10'
            ),
            createRepetitionEvent(
              '507f1f77bcf86cd799439015',
              '507f1f77bcf86cd799439010',
              'TypeError: Cannot read property \'user\' of undefined',
              'TypeError',
              'hash-507f1f77bcf86cd799439011',
              Date.now() - 3600000,
              39,
              'Safari/537.36 (Macintosh; Intel Mac OS X 10_15_7)',
              'macOS 10.15.7'
            ),
            createRepetitionEvent(
              '507f1f77bcf86cd799439016',
              '507f1f77bcf86cd799439010',
              'TypeError: Cannot read property \'user\' of undefined',
              'TypeError',
              'hash-507f1f77bcf86cd799439011',
              Date.now() - 7200000,
              37,
              'Mobile Safari 17.2 (iPhone; CPU iPhone OS 17_2 like Mac OS X)',
              'iOS 17.2'
            ),
            createRepetitionEvent(
              '507f1f77bcf86cd799439017',
              '507f1f77bcf86cd799439010',
              'TypeError: Cannot read property \'user\' of undefined',
              'TypeError',
              'hash-507f1f77bcf86cd799439011',
              Date.now() - 10800000,
              35,
              'Firefox 122.0 (X11; Linux x86_64)',
              'Linux'
            ),
          ] as HawkEvent[],
          nextCursor: null,
        },
      },
    },
  },
  errors: [],
};

export default mockGetRepetitionsPortion;
