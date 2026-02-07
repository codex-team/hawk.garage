import type { HawkEvent } from '@/types/events';

/**
 * Mock data for getEvent - detailed event information
 */
const mockGetEvent: HawkEvent = {
  id: '507f1f77bcf86cd799439011',
  originalEventId: '507f1f77bcf86cd799439010',
  groupHash: 'hash-507f1f77bcf86cd799439011',
  totalCount: 42,
  usersAffected: 8,
  timestamp: Date.now(),
  originalTimestamp: Date.now() - 604800000, // 1 week ago
  payload: {
    title: 'TypeError: Cannot read property \'user\' of undefined',
    type: 'TypeError',
    backtrace: [
      {
        file: 'src/store/user.ts',
        line: 42,
        column: 15,
        function: 'getUserProfile',
        arguments: ['userId'],
        sourceCode: [
          { line: 40, content: 'export const getUserProfile = (userId) => {' },
          { line: 41, content: '  const user = store.getters.user;' },
          { line: 42, content: '  return user.profile.settings;' },
          { line: 43, content: '};' },
        ],
      },
      {
        file: 'src/components/UserPanel.vue',
        line: 28,
        column: 8,
        function: 'onMounted',
        arguments: [],
        sourceCode: [
          { line: 26, content: 'onMounted(() => {' },
          { line: 27, content: '  profile.value = getUserProfile(userId);' },
          { line: 28, content: '  console.log(profile.value.email);' },
          { line: 29, content: '});' },
        ],
      },
    ],
    get: {
      userId: '507f1f77bcf86cd799439011',
      profileId: '507f191e810c19729de860ea',
      format: 'json',
    },
    post: {
      action: 'loadUserProfile',
      timestamp: Date.now(),
      requestId: 'req-507f1f77bcf86cd799439011',
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Request-ID': 'req-507f1f77bcf86cd799439011',
      'Referer': 'http://localhost:8080/project/6215743cf3ff6b80215cb183',
    },
    release: 'v1.2.3',
    user: {
      id: 'user-demo-001',
    } as any,
    context: {
      browser: 'Chrome 120.0.0',
      os: 'macOS 14.2.1 (Sonoma)',
      screen: '1920x1080',
      timezone: 'UTC+2',
      language: 'en-US',
      url: 'http://localhost:8080/project/6215743cf3ff6b80215cb183/events/507f1f77bcf86cd799439011',
      referrer: 'http://localhost:8080/project/6215743cf3ff6b80215cb183',
    },
    addons: {} as any,
  },
  catcherType: 'client/javascript',
  repetitions: [],
  visitedBy: [],
  marks: {
    resolved: false,
    starred: true,
    ignored: false,
  },
  assignee: undefined as any,
};

export default mockGetEvent;
