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
 *
 * Sends: checksum, cardId, isRecurrent
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
 * Prepare payment data before opening CloudPayments widget.
 *
 * Sends (ComposePaymentInput):
 *   workspaceId, tariffPlanId, shouldSaveCard?, promoCode?, promoUtm?
 *
 * Receives (calculated on server):
 *   chargeAmount — actual amount to charge (card validation, promo price, or full plan price)
 *   plan.monthlyCharge — full tariff price (for recurrent)
 *   promo — server-validated discount breakdown for UI
 *   checksum, invoiceId, etc.
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
      chargeAmount
      isCardLinkOperation
      currency
      checksum
      nextPaymentDate
      cloudPaymentsPublicId
      promo {
        originalAmount
        finalAmount
      }
    }
  }
`;

// language=GraphQL
/**
 * Verify promo code before payment (UI discount preview).
 *
 * Sends (VerifyPromoCodeInput):
 *   workspaceId, value
 *
 * Receives (benefit data for client-side price calculation):
 *   value, benefitType, percent?, amount?, minFinalPrice?, applicablePlanIds?
 */
export const MUTATION_VERIFY_PROMO_CODE = `
  mutation VerifyPromoCode($input: VerifyPromoCodeInput!) {
    verifyPromoCode(input: $input) {
      value
      benefitType
      percent
      amount
      minFinalPrice
      applicablePlanIds
    }
  }
`;
