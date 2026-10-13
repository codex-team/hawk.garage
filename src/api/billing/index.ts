import { MUTATION_PAY_WITH_CARD, QUERY_BUSINESS_OPERATIONS, QUERY_COMPOSE_PAYMENT } from './queries';
import * as api from '../';
import { withDemoMock } from '@/utils/withDemoMock';
import type { BusinessOperation } from '../../types/business-operation';
import type { BeforePaymentPayload } from '@/types/before-payment-payload';

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
 * Process payment via saved card
 * @param input - data for payment processing
 */
export async function payWithCard(input: PayWithCardInput): Promise<unknown> {
  return (await api.callOld(MUTATION_PAY_WITH_CARD, { input })).payWithCard.record;
}

/**
 * Prepare payment data (compose payment)
 * @param workspaceId - id of workspace
 * @param tariffPlanId - id of plan
 * @param shouldSaveCard - whether to save the card
 * @param promoCode - optional promo code to apply
 */
export async function composePayment(
  workspaceId: string,
  tariffPlanId: string,
  shouldSaveCard = false,
  promoCode?: string
) {
  return await api.call<{ composePayment: BeforePaymentPayload }>(QUERY_COMPOSE_PAYMENT, {
    input: {
      workspaceId,
      tariffPlanId,
      shouldSaveCard,
      promoCode,
    },
  }, undefined, { allowErrors: true });
}
