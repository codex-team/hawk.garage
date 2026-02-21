/**
 * Mock database: Events
 *
 * Contains demo error events with realistic data
 */

import type { HawkEvent, User } from '@hawk.so/types';
import { MILLISECONDS_IN_SECOND, SECONDS_IN_DAY } from '@/utils/time';
import { DEMO_PROJECT_ID } from './workspaces';
import { DEMO_USER } from './users';

const NOW_SECONDS = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);

/**
 * Helper to create realistic error event
 * @param config
 */
function createDemoEvent(config: {
  id: string;
  originalEventId: string;
  title: string;
  type: string;
  groupHash: string;
  totalCount: number;
  usersAffected: number;
  timestamp?: number;
  file?: string;
  line?: number;
  isStarred?: boolean;
  isResolved?: boolean;
  isIgnored?: boolean;
  visitedBy?: User[];
}): HawkEvent {
  const {
    id,
    originalEventId,
    title,
    type,
    groupHash,
    totalCount,
    usersAffected,
    timestamp = Math.floor(Date.now() / MILLISECONDS_IN_SECOND),
    file = 'src/store/user.ts',
    line = 42,
    isStarred = false,
    isResolved = false,
    isIgnored = false,
    visitedBy = [],
  } = config;

  return {
    id,
    groupHash,
    totalCount,
    usersAffected,
    visitedBy,
    marks: {
      resolved: isResolved,
      starred: isStarred,
      ignored: isIgnored,
    },
    payload: {
      title,
      type,
      backtrace: [
        {
          file,
          line,
          column: 15,
          function: 'getUserProfile',
          arguments: ['userId'],
          sourceCode: [
            { line: line - 2,
              content: 'export const getUserProfile = (userId) => {' },
            { line: line - 1,
              content: '  const user = store.getters.user;' },
            { line,
              content: '  return user.profile.settings;' },
            { line: line + 1,
              content: '};' },
          ],
        },
      ],
      get: {
        userId: '507f1f77bcf86cd799439011',
        format: 'json',
      },
      post: {},
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      release: 'v1.2.3',
      user: {
        id: 'user-demo-001',
      } as any,
      context: {
        browser: 'Chrome 120.0.0',
        os: 'macOS 14.2.1',
        screen: '1920x1080',
        timezone: 'UTC+2',
        language: 'en-US',
        url: `http://localhost:8080/project/${DEMO_PROJECT_ID}`,
      },
      addons: {} as any,
    },
    catcherType: 'client/javascript',
    repetitions: [],
    assignee: undefined as any,
    timestamp,
    originalTimestamp: timestamp - SECONDS_IN_DAY,
    originalEventId,
  };
}

/**
 * Demo events collection
 */
export const DEMO_EVENTS: HawkEvent[] = [
  createDemoEvent({
    id: '507f1f77bcf86cd799439011',
    originalEventId: '507f1f77bcf86cd799439010',
    title: 'TypeError: Cannot read property \'user\' of undefined',
    type: 'TypeError',
    groupHash: 'hash-507f1f77bcf86cd799439011',
    totalCount: 42,
    usersAffected: 8,
    isStarred: true,
    timestamp: NOW_SECONDS - 7 * 60,
  }),
  createDemoEvent({
    id: '507f191e810c19729de860ea',
    originalEventId: '507f191e810c19729de860e9',
    title: 'ReferenceError: apiKey is not defined',
    type: 'ReferenceError',
    groupHash: 'hash-507f191e810c19729de860ea',
    totalCount: 18,
    usersAffected: 5,
    file: 'src/api/config.ts',
    line: 15,
    isResolved: true,
    timestamp: NOW_SECONDS - 49 * 60,
  }),
  createDemoEvent({
    id: '507f1f77bcf86cd799439012',
    originalEventId: '507f1f77bcf86cd799439013',
    title: 'Network Error: Failed to fetch user data',
    type: 'NetworkError',
    groupHash: 'hash-507f1f77bcf86cd799439012',
    totalCount: 7,
    usersAffected: 3,
    file: 'src/api/user/index.ts',
    line: 28,
    timestamp: NOW_SECONDS - 3 * 60 * 60,
  }),
  createDemoEvent({
    id: '507f1f77bcf86cd799439014',
    originalEventId: '507f1f77bcf86cd799439015',
    title: 'SyntaxError: Unexpected token < in JSON',
    type: 'SyntaxError',
    groupHash: 'hash-507f1f77bcf86cd799439014',
    totalCount: 12,
    usersAffected: 4,
    file: 'src/utils/parser.ts',
    line: 55,
    isIgnored: true,
    visitedBy: [DEMO_USER],
    timestamp: NOW_SECONDS - 9 * 60 * 60,
  }),
  ...[
    {
      title: 'TypeError: Cannot destructure property \"profile\" of null',
      type: 'TypeError',
      file: 'src/components/account/ProfileCard.vue',
      line: 73,
      totalCount: 26,
      usersAffected: 7,
      isStarred: true,
    },
    {
      title: 'Network Error: request timeout while loading dashboard',
      type: 'NetworkError',
      file: 'src/api/projects/index.js',
      line: 114,
      totalCount: 31,
      usersAffected: 11,
    },
    {
      title: 'RateLimitError: Too many requests to /events endpoint',
      type: 'RateLimitError',
      file: 'src/api/events/index.ts',
      line: 87,
      totalCount: 9,
      usersAffected: 5,
      isIgnored: true,
    },
    {
      title: 'ReferenceError: config is not defined in init script',
      type: 'ReferenceError',
      file: 'src/main.ts',
      line: 22,
      totalCount: 14,
      usersAffected: 4,
    },
    {
      title: 'RangeError: Maximum call stack size exceeded in serializer',
      type: 'RangeError',
      file: 'src/utils/serializer.ts',
      line: 129,
      totalCount: 19,
      usersAffected: 6,
    },
    {
      title: 'TypeError: Failed to execute \"appendChild\" on \"Node\"',
      type: 'TypeError',
      file: 'src/components/modals/BaseModal.vue',
      line: 101,
      totalCount: 23,
      usersAffected: 9,
      isResolved: true,
    },
    {
      title: 'RateLimitError: Ingestion quota exceeded for project token',
      type: 'RateLimitError',
      file: 'src/api/index.ts',
      line: 438,
      totalCount: 12,
      usersAffected: 3,
    },
    {
      title: 'SyntaxError: Unexpected end of JSON input',
      type: 'SyntaxError',
      file: 'src/store/modules/events/index.ts',
      line: 241,
      totalCount: 8,
      usersAffected: 4,
      isResolved: true,
    },
  ].flatMap((template, index) => {
    const minuteOffsets = [
      75,
      115,
      170,
      260,
      360,
      510,
      720,
      960,
      1410,
      1890,
      2520,
      3360,
      4290,
      5370,
      6960,
      8400,
      10080,
      12180,
      14640,
      17220,
      20160,
      23040,
      25920,
      28800,
      31680,
      34560,
      37440,
      40320,
      41760,
    ];

    return minuteOffsets
      .filter((_, offsetIndex) => offsetIndex % 8 === index)
      .map((offsetMinutes, offsetIndex) => {
        const sequence = index * 10 + offsetIndex;
        const idSuffix = String(1000 + sequence).padStart(4, '0');
        const originalSuffix = String(2000 + sequence).padStart(4, '0');
        const totalCount = template.totalCount + (offsetIndex % 3) * 4;
        const usersAffected = Math.max(1, Math.min(totalCount, template.usersAffected + (offsetIndex % 2)));

        return createDemoEvent({
          id: `507f1f77bcf86cd79944${idSuffix}`,
          originalEventId: `507f1f77bcf86cd79945${originalSuffix}`,
          title: template.title,
          type: template.type,
          groupHash: `hash-507f1f77bcf86cd79944${idSuffix}`,
          totalCount,
          usersAffected,
          file: template.file,
          line: template.line,
          isStarred: Boolean(template.isStarred),
          isResolved: Boolean(template.isResolved),
          isIgnored: Boolean(template.isIgnored),
          timestamp: NOW_SECONDS - offsetMinutes * 60,
        });
      });
  }),
];

/**
 * Get event by ID
 * @param id
 */
export function getDemoEventById(id: string): HawkEvent | undefined {
  return DEMO_EVENTS.find(event => event.id === id);
}
