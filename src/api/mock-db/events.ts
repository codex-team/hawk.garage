/**
 * Mock database: Events
 *
 * Contains demo error events with realistic data
 */

import type { HawkEvent, User } from '@hawk.so/types';
import { MILLISECONDS_IN_SECOND, SECONDS_IN_DAY } from '@/utils/time';
import { DEMO_PROJECT_ID } from './workspaces';
import { DEMO_USER } from './users';

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
    visitedBy = [],
  } = config;

  return {
    id,
    groupHash,
    totalCount,
    usersAffected,
    visitedBy,
    marks: {
      resolved: false,
      starred: isStarred,
      ignored: false,
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
    visitedBy: [DEMO_USER],
  }),
];

/**
 * Get event by ID
 * @param id
 */
export function getDemoEventById(id: string): HawkEvent | undefined {
  return DEMO_EVENTS.find(event => event.id === id);
}
