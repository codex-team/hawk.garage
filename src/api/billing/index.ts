import { MUTATION_PAY_WITH_CARD, QUERY_BUSINESS_OPERATIONS, QUERY_COMPOSE_PAYMENT } from './queries';
import * as api from '../';
import { BusinessOperation } from '../../types/business-operation';
import { BeforePaymentPayload } from '@/types/before-payment-payload';

/**
 * Request business operations list for passed workspaces
 *
 * @param ids - ids of workspaces
 */
export async function getBusinessOperations(ids: string[]): Promise<BusinessOperation[]> {
  return (await api.callOld(QUERY_BUSINESS_OPERATIONS, { ids })).businessOperations;
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
 * Process payment via saved card
 *
 * @param input - data for payment processing
 */
export async function payWithCard(input: PayWithCardInput): Promise<unknown> {
  return (await api.callOld(MUTATION_PAY_WITH_CARD, { input })).payWithCard.record;
}

/**
 * Prepare payment data (compose payment)
 *
 * @param workspaceId - id of workspace
 * @param tariffPlanId - id of plan
 * @param shouldSaveCard - whether to save the card
 */
export async function composePayment(
  workspaceId: string,
  tariffPlanId: string,
  shouldSaveCard = false
): Promise<unknown> {
  return await api.call(QUERY_COMPOSE_PAYMENT, {
    input: { workspaceId, tariffPlanId, shouldSaveCard },
  });
}
