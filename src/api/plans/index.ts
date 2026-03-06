import * as api from '@/api';
import { QUERY_PLANS } from './queries';

import type { Plan } from '@/types/plan';

/**
 * Fetch all available plans
 */
export async function getPlans(): Promise<Plan[]> {
  return (await api.callOld(QUERY_PLANS)).plans;
}
