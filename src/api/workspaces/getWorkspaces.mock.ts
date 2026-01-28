import type { Project } from '@/types/project';
import { DEMO_PROJECT_ID, DEMO_WORKSPACE_ID } from '@/utils/withDemoMock';
import { DEMO_USER } from '@/api/user/demoUser.mock';
import mockDailyEventsPortion from '@/api/events/fetchDailyEventsPortion.mock';

/**
 * Demo project for workspace with comprehensive mock data
 */
export const DEMO_PROJECT: Project = {
  id: DEMO_PROJECT_ID,
  workspaceId: DEMO_WORKSPACE_ID,
  token: 'token_6215743cf3ff6b80215cb183_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJodHRwczovL2hhd2suc28iLCJzdWIiOiIyMjQ2MjExODUyMjcwMzY4MzIiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2MDMzOTAwMDB9',
  name: 'Production Application',
  uidAdded: DEMO_USER,
  unreadCount: 5,
  description: 'Production environment - real-time error tracking and monitoring for main application',
  image: 'https://ui-avatars.com/api/?name=Production+App&background=FF6B6B',
  notifications: [
    {
      id: 'notif-001',
      rule: {
        channels: {
          email: true,
          slack: true,
          telegram: false,
        },
        receiveType: {
          onlyNew: false,
          onlyAssigned: false,
        },
      },
    },
  ],
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
  ],
  rateLimitSettings: {
    N: 100000,
    T: 86400,
  },
};

/**
 * Enrich project with daily events portion for display in workspace
 */
const projectWithEvents = {
  ...DEMO_PROJECT,
  dailyEventsPortion: mockDailyEventsPortion,
};

/**
 * Demo workspace with demo project
 */
const mockWorkspaceWithProject = {
  data: {
    workspaces: [
      {
        id: DEMO_WORKSPACE_ID,
        projects: [projectWithEvents],
      },
    ],
  },
  errors: [],
};

export default mockWorkspaceWithProject;
