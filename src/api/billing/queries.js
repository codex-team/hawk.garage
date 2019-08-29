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
