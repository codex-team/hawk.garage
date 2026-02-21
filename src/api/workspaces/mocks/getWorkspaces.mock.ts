import type { Workspace } from '@/types/workspaces';
import { DEMO_WORKSPACE, DEMO_WORKSPACE_ID } from '@/api/mock-db';

/**
 * Mock: getWorkspaces
 *
 * Returns demo workspace if requesting for demo workspace ID
 */
export default function mockGetWorkspaces(ids: string[]): Workspace[] {
  if (!ids || ids.length === 0) {
    return [];
  }

  // Return demo workspace if demo workspace ID is requested
  if (ids.includes(DEMO_WORKSPACE_ID)) {
    return [DEMO_WORKSPACE];
  }

  return [];
}
