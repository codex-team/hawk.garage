import { MUTATION_PAY_WITH_CARD, MUTATION_VERIFY_PROMO_CODE, QUERY_BUSINESS_OPERATIONS, QUERY_COMPOSE_PAYMENT } from './queries';
import * as api from '../';
import type { BusinessOperation } from '../../types/business-operation';
import type { ComposePaymentInput, PayWithCardInput, PromoCodeVerify, PromoCodeVerifyInput } from '@/types/billing';

/**
 * Request business operations list for passed workspaces
 * @param ids - ids of workspaces
 */
export async function getBusinessOperations(ids: string[]): Promise<BusinessOperation[]> {
  const response = await api.call<{ businessOperations: BusinessOperation[] }>(QUERY_BUSINESS_OPERATIONS, { ids });

  return response.data?.businessOperations || [];
}

/**
 * Process payment via saved card
 * @param input - data for payment processing
 */
export async function payWithCard(input: PayWithCardInput): Promise<unknown> {
  const response = await api.call<{ payWithCard: { record: unknown } }>(MUTATION_PAY_WITH_CARD, { input });

  return response.data?.payWithCard.record;
}

/**
 * Prepare payment data (compose payment)
 * @param input - compose payment input
 */
export async function composePayment(
  input: ComposePaymentInput
): Promise<unknown> {
  return await api.call(QUERY_COMPOSE_PAYMENT, {
    input,
  });
}

/**
 * Verify promo code and return validated benefit data.
 * @param input - promo code input
 */
export async function verifyPromoCode(input: PromoCodeVerifyInput): Promise<PromoCodeVerify> {
  const response = await api.call<{ verifyPromoCode: PromoCodeVerify }>(MUTATION_VERIFY_PROMO_CODE, { input });

  if (!response.data) {
    throw new Error('Empty promo code response');
  }

  return response.data.verifyPromoCode;
}
