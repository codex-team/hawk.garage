// language=GraphQL
/**
 * Query to retrieve payment link
 */
export const QUERY_PAYMENT_LINK = `
  mutation PayOnce($paymentInput: PayOnceInput!) {
    payOnce(input: $paymentInput) {
      amount
      status
      success
      paymentURL
    }
  }
`;

// language=GraphQL
/**
 * Query to fetch transactions info by workspaces ids
 */
export const QUERY_TRANSACTIONS = `
  query transactions($ids: [ID!] = []) {
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
