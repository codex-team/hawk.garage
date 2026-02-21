import * as api from '@/api';
import { QUERY_PLANS } from './queries';
import { withDemoMock } from '@/utils/withDemoMock';

import type { Plan } from '@/types/plan';

/**
 * Fetch all available plans
 */
async function getPlansRequest(): Promise<Plan[]> {
  return (await api.callOld(QUERY_PLANS)).plans;
}

export const getPlans = withDemoMock(
  getPlansRequest,
  '/src/api/plans/mocks/getPlans.mock.ts'
);
