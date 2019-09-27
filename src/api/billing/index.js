import { QUERY_PAYMENT_LINK, QUERY_TRANSACTIONS } from './queries';
import * as api from '../index.ts';

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
 * Transaction info
 *
 * @typedef {object} Transaction
 * @property {string} id - transaction id
 * @property {string} type - transaction type ('income' or 'charge')
 * @property {number} amount - transaction amount
 * @property {Workspace} workspace - workspace for which transaction has been proceed
 * @property {number} date - transaction date
 * @property {User} user - user by whom transaction has been made (income transactions only)
 * @property {number} cardPan - PAN of card by which transaction was made (income transactions only)
 */

/**
 * Request transactions info for passed workspaces
 *
 * @param {string[]} ids - ids of workspaces
 * @returns {Promise<Transaction>}
 */
export async function getTransactions(ids) {
  return (await api.call(QUERY_TRANSACTIONS, { ids })).transactions;
}
