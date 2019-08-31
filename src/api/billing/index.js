import { QUERY_PAYMENT_LINK, QUERY_TRANSACTIONS } from './queries';
import * as api from '../index';

/**
 * Request payment link
 *
 * @param {object} paymentQuery
 * @param {string} paymentQuery.language — interface language
 * @param {string} paymentQuery.workspaceId - id of workspace for which payment should be proceeded
 * @param {number} paymentQuery.amount — payment amount
 * @returns {Promise<PaymentLink>}
 */
export async function getPaymentLink(paymentQuery) {
  return (await api.call(QUERY_PAYMENT_LINK, { paymentQuery })).paymentLink;
}

/**
 * Request transactions info for passed workspaces
 *
 * @param {string[]} ids - ids of workspaces
 * @returns {Promise<Transaction>}
 */
export async function getTransactions(ids) {
  return (await api.call(QUERY_TRANSACTIONS, { ids })).transactions;
}
