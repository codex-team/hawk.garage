/**
 * Get available tariff plans
 */
// language=GraphQL
export const QUERY_PLANS = `
    query Plans {
      plans {
        id
        name
        monthlyCharge
        monthlyChargeCurrency
        eventsLimit
      }
    }
`;
