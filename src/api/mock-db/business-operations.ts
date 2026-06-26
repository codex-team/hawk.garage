/**
 * Mock database: Business Operations (Payment History)
 */

import type { BusinessOperation, PayloadOfWorkspacePlanPurchase } from '@/types/business-operation';
import { BusinessOperationType } from '@/types/business-operation-type';
import { BusinessOperationStatus } from '@/types/business-operation-status';
import { DEMO_USER, DEMO_TEAM_MEMBERS } from './users';
import { DEMO_WORKSPACE_ID } from './workspaces';

/**
 * Demo business operations (payment history)
 */
export const DEMO_BUSINESS_OPERATIONS: BusinessOperation<PayloadOfWorkspacePlanPurchase>[] = [
  {
    transactionId: 'txn-001-pro-current',
    type: BusinessOperationType.WorkspacePlanPurchase,
    status: BusinessOperationStatus.Confirmed,
    payload: {
      workspace: {
        id: DEMO_WORKSPACE_ID,
        name: 'Demo Workspace',
      } as any,
      amount: 95000,
      user: DEMO_USER,
    },
    dtCreated: new Date('2026-02-15').getTime(),
  },
  {
    transactionId: 'txn-002-pro-prev',
    type: BusinessOperationType.WorkspacePlanPurchase,
    status: BusinessOperationStatus.Confirmed,
    payload: {
      workspace: {
        id: DEMO_WORKSPACE_ID,
        name: 'Demo Workspace',
      } as any,
      amount: 95000,
      user: DEMO_USER,
    },
    dtCreated: new Date('2026-01-15').getTime(),
  },
  {
    transactionId: 'txn-003-pro-old',
    type: BusinessOperationType.WorkspacePlanPurchase,
    status: BusinessOperationStatus.Confirmed,
    payload: {
      workspace: {
        id: DEMO_WORKSPACE_ID,
        name: 'Demo Workspace',
      } as any,
      amount: 95000,
      user: DEMO_TEAM_MEMBERS[0],
    },
    dtCreated: new Date('2025-12-15').getTime(),
  },
  {
    transactionId: 'txn-004-basic-old',
    type: BusinessOperationType.WorkspacePlanPurchase,
    status: BusinessOperationStatus.Confirmed,
    payload: {
      workspace: {
        id: DEMO_WORKSPACE_ID,
        name: 'Demo Workspace',
      } as any,
      amount: 9900,
      user: DEMO_TEAM_MEMBERS[0],
    },
    dtCreated: new Date('2025-11-15').getTime(),
  },
];
