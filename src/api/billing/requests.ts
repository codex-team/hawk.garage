import { BeforePaymentPayload } from '@/types/before-payment-payload';
import axios from 'axios';
import { API_ENDPOINT } from '..';

/**
 * @param workspaceId
 * @param tariffPlanId
 * @param shouldSaveCard
 */
export async function composePayment(workspaceId: string, tariffPlanId: string, shouldSaveCard = false): Promise<BeforePaymentPayload> {
  const url = new URL(`${API_ENDPOINT}/billing/compose-payment`);

  url.searchParams.set('workspaceId', workspaceId);
  url.searchParams.set('tariffPlanId', tariffPlanId);
  url.searchParams.set('shouldSaveCard', shouldSaveCard.toString());

  const response = await axios.get<BeforePaymentPayload>(url.toString());

  return response.data;
}
