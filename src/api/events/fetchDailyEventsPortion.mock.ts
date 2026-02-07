import type { DailyEventsPortion, HawkEvent } from '@/types/events';

/**
 * Create a complete mock event with all fields
 */
const createDemoEvent = (
  id: string,
  originalId: string,
  title: string,
  type: string,
  groupHash: string,
  totalCount: number,
  usersAffected: number
): HawkEvent => ({
  id,
  groupHash,
  totalCount,
  visitedBy: [],
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
      userId: '507f1f77bcf86cd799439011',
      format: 'json',
    },
    post: {
      action: 'getUserData',
      timestamp: Date.now(),
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Requested-With': 'XMLHttpRequest',
    },
    release: 'v1.0.0',
    user: {
      id: 'user-demo-001',
    } as any,
    context: {
      browser: 'Chrome 120.0.0',
      os: 'macOS 14.2.1',
      screen: '1920x1080',
      timezone: 'UTC+2',
      language: 'en-US',
      url: 'http://localhost:8080/project/6215743cf3ff6b80215cb183',
      referrer: 'http://localhost:8080/workspaces',
    },
    addons: {} as any,
  },
  catcherType: 'client/javascript',
  repetitions: [],
  usersAffected,
  assignee: undefined as any,
  timestamp: Date.now(),
  originalTimestamp: Date.now() - 86400000,
  originalEventId: originalId,
});

/**
 * Helper to create fresh mock data each time (prevents mutation issues)
 */
const createMockDailyEventsPortion = (): DailyEventsPortion => ({
  nextCursor: null,
  dailyEvents: [
    {
      id: '6789abcd1234567890123456',
      groupingTimestamp: Math.floor(Date.now() / 86400000) * 86400000,
      count: 42,
      affectedUsers: 8,
      event: createDemoEvent(
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439010',
        'TypeError: Cannot read property \'user\' of undefined',
        'TypeError',
        'hash-507f1f77bcf86cd799439011',
        42,
        8
      ),
    },
    {
      id: '6789abcd1234567890123457',
      groupingTimestamp: Math.floor(Date.now() / 86400000) * 86400000,
      count: 18,
      affectedUsers: 5,
      event: createDemoEvent(
        '507f191e810c19729de860ea',
        '507f191e810c19729de860e9',
        'ReferenceError: apiKey is not defined',
        'ReferenceError',
        'hash-507f191e810c19729de860ea',
        18,
        5
      ),
    },
    {
      id: '6789abcd1234567890123458',
      groupingTimestamp: Math.floor(Date.now() / 86400000) * 86400000,
      count: 7,
      affectedUsers: 3,
      event: createDemoEvent(
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439013',
        'Network Error: Failed to fetch user data from API',
        'NetworkError',
        'hash-507f1f77bcf86cd799439012',
        7,
        3
      ),
    },
    {
      id: '6789abcd1234567890123459',
      groupingTimestamp: Math.floor(Date.now() / 86400000) * 86400000,
      count: 12,
      affectedUsers: 4,
      event: createDemoEvent(
        '507f1f77bcf86cd799439014',
        '507f1f77bcf86cd799439015',
        'SyntaxError: Unexpected token < in JSON at position 0',
        'SyntaxError',
        'hash-507f1f77bcf86cd799439014',
        12,
        4
      ),
    },
  ],
});

// Validate structure (create instance just for validation logs)
const sampleMock = createMockDailyEventsPortion();
console.log('[🔍 DEBUG] fetchDailyEventsPortion mock export - dailyEvents structure:');
sampleMock.dailyEvents.forEach((de, i) => {
  if (de.event?.id) {
    console.log(`  ✅ Event ${i}: eventId=${de.event.id} (${de.event.payload?.title})`);
  } else {
    console.error(`  ❌ Event ${i}: MISSING event.id!`, de);
  }
});

// Export function that creates fresh mock each time
export default createMockDailyEventsPortion;
