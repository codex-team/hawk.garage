import type { Workspace } from '@/types/workspaces';
import { DEMO_PROJECT_ID, DEMO_WORKSPACE_ID } from '@/utils/withDemoMock';
import { DEMO_USER } from '@/api/user/demoUser.mock';
import { DEMO_PROJECT } from './getWorkspaces.mock';
import mockDailyEventsPortion from '@/api/events/fetchDailyEventsPortion.mock';

/**
 * Demo workspace with demo project
 */
export const DEMO_WORKSPACE: Workspace = {
  id: DEMO_WORKSPACE_ID,
  workspaceId: DEMO_WORKSPACE_ID,
  name: 'Demo Workspace - Error Tracking Hub',
  description: 'Comprehensive workspace for monitoring and managing application errors in real-time',
  image: 'https://ui-avatars.com/api/?name=Demo+Workspace&background=FF6B6B',
  inviteHash: 'demo-invite-hash-abc123def456',
  team: [
    {
      id: 'member-001-admin',
      user: DEMO_USER,
      isAdmin: true,
    },
    {
      id: 'member-002-dev',
      user: {
        id: 'dev-user-001',
        email: 'dev@example.com',
        name: 'John Developer',
        image: 'https://ui-avatars.com/api/?name=John+Developer&background=4ECDC4',
      },
      isAdmin: false,
    },
    {
      id: 'member-003-lead',
      user: {
        id: 'lead-user-001',
        email: 'team-lead@example.com',
        name: 'Sarah Team Lead',
        image: 'https://ui-avatars.com/api/?name=Sarah+Lead&background=95E1D3',
      },
      isAdmin: true,
    },
  ],
  plan: {
    id: 'pro-plan-001',
    name: 'Professional',
    monthlyCount: 100000,
    priceMonthly: 99,
    priceYearly: 990,
  },
  lastChargeDate: new Date('2026-01-15'),
  isDebug: true,
  isBlocked: false,
};

/**
 * Enrich project with daily events portion for display in workspace
 * Create fresh copy to prevent mutation
 */
const projectWithEvents = {
  ...DEMO_PROJECT,
  dailyEventsPortion: mockDailyEventsPortion(),
};

const mockAllWorkspacesWithProjects = {
  data: {
    workspaces: [
      {
        ...DEMO_WORKSPACE,
        projects: [projectWithEvents],
      },
    ],
  },
  errors: [],
};

export default mockAllWorkspacesWithProjects;
