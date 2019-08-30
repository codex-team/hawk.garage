// language=GraphQL
/**
 * Query to retrieve payment link
 * @type {string}
 */
export const QUERY_PAYMENT_LINK = `
  query paymentLink($paymentQuery: PaymentQuery!) {
    paymentLink(paymentQuery: $paymentQuery) {
      Amount
      Status
      Success
      PaymentURL
    }
  }
`;

// language=GraphQL
/**
 * Query to fetch transactions info by workspaces ids
 * @type {string}
 */
export const QUERY_TRANSACTIONS = `
  query transactions($ids: [ID] = []) {
    transactions(ids: $ids) {
        type
        amount
        date
        workspace {
            id
            name
        }
        user {
            id
            image
            name
            email
        }
        cardPan
    }
  }
`;
