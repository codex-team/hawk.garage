import { MUTATION_PAY_WITH_CARD, MUTATION_VERIFY_PROMO_CODE, QUERY_BUSINESS_OPERATIONS, QUERY_COMPOSE_PAYMENT } from './queries';
import * as api from '../';
import { withDemoMock } from '@/utils/withDemoMock';
import type { BusinessOperation } from '../../types/business-operation';
import type { Utm as UtmInput } from '@hawk.so/types';
import type { PromoCodeVerify, PromoCodeVerifyInput } from '@/types/promoCode';

interface ComposePaymentInput {
  workspaceId: string;
  tariffPlanId: string;
  shouldSaveCard?: boolean;

  /**
   * Promo code value entered by user.
   */
  promoCode?: string;

  promoUtm?: UtmInput;
}

/**
 * Data for processing payment with saved card
 */
export interface PayWithCardInput {
  /**
   * Checksum for payment validation
   */
  checksum: string;

  /**
   * Saved card id for payment
   */
  cardId: string;

  /**
   * Is payment recurrent or not. If payment is recurrent, then the money will be debited every month
   */
  isRecurrent?: boolean;
}

/**
 * Request business operations list for passed workspaces
 * @param ids - ids of workspaces
 */
async function getBusinessOperationsRequest(ids: string[]): Promise<BusinessOperation[]> {
  return (await api.callOld(QUERY_BUSINESS_OPERATIONS, { ids })).businessOperations;
}

export const getBusinessOperations = withDemoMock(
  getBusinessOperationsRequest,
  '/src/api/billing/mocks/getBusinessOperations.mock.ts'
);

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
