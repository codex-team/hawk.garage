import { QUERY_PAYMENT_LINK } from './queries';
import * as api from '../index';

/**
 * Request payment link
 *
 * @param {object} paymentQuery
 * @param {string} paymentQuery.language — interface language
 * @oaram {string} paymentQuery.workspaceId - id of workspace for which payment should be proceeded
 * @param {number} paymentQuery.amount — payment amount
 * @returns {Promise<PaymentLink>}
 */
export async function getPaymentLink(paymentQuery) {
  return (await api.call(QUERY_PAYMENT_LINK, { paymentQuery })).paymentLink;
}
