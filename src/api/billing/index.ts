import { QUERY_PAYMENT_LINK, QUERY_BUSINESS_OPERATIONS } from './queries';
import * as api from '../';
import { BusinessOperation } from '../../types/business-operation';

/**
 * Languages supported by the Tinkoff
 */
enum SupportedBillingLanguages {
  EN = 'EN',
  RU = 'RU'
}

/**
 * Input for single payment
 */
interface PayOnceInput {
  /**
   * Total payment amount in kopecs
   */
  amount: number;

  /**
   * Workspace id for which the payment will be made
   */
  workspaceId: string;

  /**
   * Payment form language
   */
  language: SupportedBillingLanguages;
}

/**
 * Billing session. Creates after payment query
 */
interface BillingSession {
  /**
   * Total payment amount in kopecs
   */
  amount: number;

  /**
   * Payment status
   */
  status: string;

  /**
   * If the payment is successful
   */
  success: boolean;

  /**
   * URL to the payment page
   */
  paymentURL: string;
}

/**
 * Request payment link
 *
 * @param paymentInput - data for payment
 */
export async function getPaymentLink(paymentInput: PayOnceInput): Promise<BillingSession> {
  return (await api.call(QUERY_PAYMENT_LINK, { paymentInput })).payOnce;
}

/**
 * Request business operations list for passed workspaces
 *
 * @param ids - ids of workspaces
 */
export async function getBusinessOperations(ids: string[]): Promise<BusinessOperation[]> {
  return (await api.call(QUERY_BUSINESS_OPERATIONS, { ids })).businessOperations;
}
