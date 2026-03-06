import type { BusinessOperation } from '@/types/business-operation';
import { DEMO_WORKSPACE_ID, DEMO_BUSINESS_OPERATIONS } from '@/api/mock-db';

/**
 * Mock: getBusinessOperations
 *
 * Returns demo business operations (payment history) for specified workspace IDs
 */
export default function mockGetBusinessOperations(ids: string[]): BusinessOperation[] {
  // Return demo operations if requesting for demo workspace
  if (ids.includes(DEMO_WORKSPACE_ID)) {
    return DEMO_BUSINESS_OPERATIONS;
  }
  return [];
}
