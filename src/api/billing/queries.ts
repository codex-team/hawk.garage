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
export const QUERY_BUSINESS_OPERATIONS = `
  query businessOperations($ids: [ID!] = []) {
    businessOperations(ids: $ids) {
      id
      type
      status
      payload {
        ...on PayloadOfDepositByUser {
          user {
            id
            name
            image
          }
          amount
          cardPan
        }

        ...on PayloadOfWorkspacePlanPurchase {
          workspace {
            id
            name
          }
          amount
        }

      }
    }
  }
`;
