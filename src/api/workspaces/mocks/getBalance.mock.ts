import type { Workspace } from '@/types/workspaces';
import { DEMO_WORKSPACE } from '@/api/mock-db';

/**
 * Mock: getBalance
 *
 * Returns demo workspace balance
 */
export default function mockGetBalance(ids: string[]): Workspace[] {
  if (!ids || ids.length === 0) {
    return [];
  }

  // Return demo workspace with mock balance
  return [DEMO_WORKSPACE];
}
