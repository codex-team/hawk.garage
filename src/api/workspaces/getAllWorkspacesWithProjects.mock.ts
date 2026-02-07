import type { Workspace } from '@/types/workspaces';
import { DEMO_PROJECT_ID, DEMO_WORKSPACE_ID } from '@/utils/withDemoMock';
import { DEMO_PROJECT } from './getWorkspaces.mock';
import mockDailyEventsPortion from '@/api/events/fetchDailyEventsPortion.mock';

/**
 * Demo workspace with demo project
 */
export const DEMO_WORKSPACE: Workspace = {
  id: DEMO_WORKSPACE_ID,
  name: 'Demo Workspace',
  description: 'Here you can check how Hawk works',
  image: 'https://static.hawk.so/fb59c4d7-db38-46d9-936e-c0d468ab1ea2.png',
  inviteHash: 'demo-invite-hash-abc123def456',
  team: [
    // {
    //   id: 'member-001-admin',
    //   user: {
    //     id: 'dev-user-000',
    //     email: 'dev@example.com',
    //     name: 'John Dev',
    //     image: 'https://ui-avatars.com/api/?name=John+Developer&background=4ECDC4',
    //   },
    //   isAdmin: true,
    // },
    // {
    //   id: 'member-002-dev',
    //   user: {
    //     id: 'dev-user-001',
    //     email: 'dev@example.com',
    //     name: 'John Developer',
    //     image: 'https://ui-avatars.com/api/?name=John+Developer&background=4ECDC4',
    //   },
    //   isAdmin: false,
    // },
    // {
    //   id: 'member-003-lead',
    //   user: {
    //     id: 'lead-user-001',
    //     email: 'team-lead@example.com',
    //     name: 'Sarah Team Lead',
    //     image: 'https://ui-avatars.com/api/?name=Sarah+Lead&background=95E1D3',
    //   },
    //   isAdmin: true,
    // },
  ],
  plan: {
    id: 'pro-plan-001',
    name: '',
    monthlyCharge: 49,
    monthlyChargeCurrency: 'USD',
    eventsLimit: 1000000,
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
