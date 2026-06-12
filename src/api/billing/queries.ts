// language=GraphQL
/**
 * Fragment with information about business operations
 */
export const FRAGMENT_BUSINESS_OPERATION = `
  fragment BusinessOperation on BusinessOperation {
    id
    type
    status
    dtCreated
    payload {
      ...on PayloadOfDepositByUser {
        user {
          id
          name
          image
        }
        workspace {
          id
          name
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
        currency
      }
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
        ...BusinessOperation
    }
  }

  ${FRAGMENT_BUSINESS_OPERATION}
`;

// language=GraphQL
/**
 * Mutation for processing payment with savedcard
 */
export const MUTATION_PAY_WITH_CARD = `
  mutation PayWithCard($input: PayWithCardInput!) {
    payWithCard(input: $input) {
      record {
        ...BusinessOperation
      }
    }
  }

  ${FRAGMENT_BUSINESS_OPERATION}
`;

// language=GraphQL
/**
 * Query to prepare payment data (GraphQL version of composePayment)
 */
export const QUERY_COMPOSE_PAYMENT = `
  query ComposePayment($input: ComposePaymentInput!) {
    composePayment(input: $input) {
      invoiceId
      plan {
        id
        name
        monthlyCharge
      }
      isCardLinkOperation
      currency
      checksum
      nextPaymentDate
      cloudPaymentsPublicId
      promo {
        id
        benefitType
        originalAmount
        finalAmount
        discountAmount
      }
    }
  }
`;

// language=GraphQL
/**
 * Mutation to preview or apply promo code
 */
export const MUTATION_PREVIEW_PROMO_CODE = `
  mutation PreviewPromoCode($input: PreviewPromoCodeInput!) {
    previewPromoCode(input: $input) {
      value
      benefitType
      applied
      percent
      amount
      plans {
        planId
        isApplicable
        originalAmount
        finalAmount
        discountAmount
      }
    }
  }
`;
