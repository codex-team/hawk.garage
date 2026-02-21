/**
 * Mock database: Workspaces & Projects
 *
 * Contains demo workspace and project data with proper references
 */

import type { Workspace, Project } from '@hawk.so/types';
import { ReceiveTypes } from '@/types/project-notifications';
import { DEMO_USER, DEMO_TEAM_MEMBERS } from './users';

/**
 * Demo workspace ID (used across the app)
 */
export const DEMO_WORKSPACE_ID = '6213b6a01e6281087467cc7a';

/**
 * Demo project ID (used across the app)
 */
export const DEMO_PROJECT_ID = '6215743cf3ff6b80215cb183';

/**
 * Second demo project ID
 */
export const DEMO_SECOND_PROJECT_ID = '7215743cf3ff6b80215cb284';

/**
 * Demo workspace with team and plan
 */
export const DEMO_WORKSPACE: Workspace = {
  id: DEMO_WORKSPACE_ID,
  name: 'Demo Workspace',
  description: 'This is a demo workspace showcasing Hawk error tracking',
  image: 'https://static.hawk.so/fb59c4d7-db38-46d9-936e-c0d468ab1ea2.png',
  inviteHash: 'demo-invite-hash',
  team: [
    {
      id: 'member-demo-001',
      user: DEMO_USER,
      isAdmin: true,
    },
    {
      id: 'member-dev-001',
      user: DEMO_TEAM_MEMBERS[0],
      isAdmin: false,
    },
    {
      id: 'member-lead-001',
      user: DEMO_TEAM_MEMBERS[1],
      isAdmin: true,
    },
  ],
  plan: {
    id: 'free',
    name: 'Бесплатный',
    monthlyCharge: 0,
    monthlyChargeCurrency: 'RUB',
    eventsLimit: 1000,
  },
  lastChargeDate: new Date('2026-01-15'),
  isDebug: true,
  isBlocked: false,
};

/**
 * Demo project within workspace
 */
export const DEMO_PROJECT: Project = {
  id: DEMO_PROJECT_ID,
  workspaceId: DEMO_WORKSPACE_ID,
  token: `hawk_${DEMO_PROJECT_ID}_demo_token`,
  name: 'Production App',
  uidAdded: DEMO_USER,
  unreadCount: 5,
  description: 'Production environment error tracker',
  image: 'https://ui-avatars.com/api/?name=Prod+App&background=4ECDC4&color=fff',
  notifications: [
    {
      id: 'notif-001',
      uidAdded: DEMO_USER.id,
      channels: {
        email: {
          endpoint: 'demo@hawk.so',
          isEnabled: true,
        },
        slack: {
          endpoint: 'https://hooks.slack.com/demo',
          isEnabled: true,
        },
        telegram: {
          endpoint: '',
          isEnabled: false,
        },
      },
      whatToReceive: ReceiveTypes.SEEN_MORE,
      isEnabled: true,
    },
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
  ],
  rateLimitSettings: {
    N: 100000,
    T: 86400,
  },
};

/**
 * Second demo project with separate stream of events
 */
export const DEMO_SECOND_PROJECT: Project = {
  id: DEMO_SECOND_PROJECT_ID,
  workspaceId: DEMO_WORKSPACE_ID,
  token: `hawk_${DEMO_SECOND_PROJECT_ID}_demo_token`,
  name: 'Mobile App Beta',
  uidAdded: DEMO_TEAM_MEMBERS[0],
  unreadCount: 11,
  description: 'Beta environment with aggressive rollout and feature flags',
  image: 'https://ui-avatars.com/api/?name=Mobile+Beta&background=FF6B6B&color=fff',
  notifications: [
    {
      id: 'notif-201',
      uidAdded: DEMO_USER.id,
      channels: {
        email: {
          endpoint: 'beta-alerts@hawk.so',
          isEnabled: true,
        },
        slack: {
          endpoint: 'https://hooks.slack.com/beta-demo',
          isEnabled: true,
        },
        telegram: {
          endpoint: '@hawk_beta_alerts',
          isEnabled: true,
        },
      },
      whatToReceive: ReceiveTypes.ONLY_NEW,
      isEnabled: true,
    },
  ],
  eventGroupingPatterns: [
    {
      id: 'pattern-201',
      pattern: 'NetworkError.*timeout.*',
    },
    {
      id: 'pattern-202',
      pattern: 'TypeError.*undefined is not an object',
    },
  ],
  rateLimitSettings: {
    N: 50000,
    T: 3600,
  },
};

/**
 * Demo projects collection
 */
export const DEMO_PROJECTS: Project[] = [DEMO_PROJECT, DEMO_SECOND_PROJECT];
