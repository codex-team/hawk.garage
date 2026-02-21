import type { BusinessOperation } from '@/types/business-operation';
import { DEMO_BUSINESS_OPERATIONS } from '@/api/mock-db/business-operations';

/**
 * Mock: getBusinessOperations
 *
 * Returns demo business operations (payment history) for specified workspace IDs
 */
export default function mockGetBusinessOperations(ids: string[]): BusinessOperation[] {
  // Return demo operations if requesting for demo workspace
  if (ids.includes('6213b6a01e6281087467cc7a')) {
    return DEMO_BUSINESS_OPERATIONS;
  }
  return [];
}
