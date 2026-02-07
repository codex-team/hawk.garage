import type { Project } from '@/types/project';
import { DEMO_PROJECT_ID, DEMO_WORKSPACE_ID } from '@/utils/withDemoMock';
import mockDailyEventsPortion from '@/api/events/fetchDailyEventsPortion.mock';

/**
 * Demo project for workspace with comprehensive mock data
 */
export const DEMO_PROJECT: Project = {
  id: DEMO_PROJECT_ID,
  workspaceId: DEMO_WORKSPACE_ID,
  token: 'token_6215743cf3ff6b80215cb183_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJodHRwczovL2hhd2suc28iLCJzdWIiOiIyMjQ2MjExODUyMjcwMzY4MzIiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2MDMzOTAwMDB9',
  name: 'Production App',
  uidAdded: {
    id: 'dev-user-000',
    email: 'dev@example.com'
  },
  unreadCount: 5,
  description: 'Production environment - real-time error tracking and monitoring for main application',
  image: 'https://ui-avatars.com/api/?name=Production+App&background=FF6B6B',
  notifications: [
  ],
  eventGroupingPatterns: [
    {
      id: 'pattern-001',
      pattern: 'TypeError.*Cannot read.*undefined',
    },
    {
      id: 'pattern-002',
      pattern: 'ReferenceError.*is not defined',
    },
    {
      id: 'pattern-003',
      pattern: 'SyntaxError.*Unexpected token',
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
